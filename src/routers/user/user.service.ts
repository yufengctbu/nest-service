import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as svgCaptcha from 'svg-captcha';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { UserLoginDto } from './user.dto';
import { RedisService } from '@app/shared/redis';
import { User, UserRole } from '@app/entities';
import { generateCode } from '@app/helpers/utils.helper';
import { AuthService } from '@app/routers/auth/auth.service';
import { FailException } from '@app/exceptions/fail.exception';
import { ERROR_CODE } from '@app/constants/error-code.constant';
import { EMAIL_VALIDITY_PERIOD } from '@app/constants/common.constant';
import { USER_STATUS, USER_CAPTCHA_EXPIRE, USER_EMAIL_TYPE } from './user.constant';
import { IUserCaptchaResponse, IUserInfo, IUserLoginResponse } from './user.interface';
import { userRegisterEmailPrefix, userLoginCachePrefix, userLoginCaptchaPrefix } from './user.helper';
import { createRegisterCodeHtml, createModifyPasswordCodeHtml, EmailerService } from '@app/shared/emailer';

@Injectable()
export class UserService {
    public constructor(
        private redisService: RedisService,
        private configService: ConfigService,
        private emailerService: EmailerService,
        private authService: AuthService,
        private readonly dataSource: DataSource,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    /**
     * 生成验证码
     * @param type
     * @param email
     */
    public async generateCode(type: USER_EMAIL_TYPE, email: string): Promise<void> {
        const currentUser = await this.userRepository.findOneBy({ email });

        // 如果是注册，那么需要验证当前的邮件是否已被注册
        if (currentUser && type === USER_EMAIL_TYPE.REGISTER) throw new FailException(ERROR_CODE.USER.USER_EMAIL_EXISTS);

        // 如果是重置密码，需要验证当前用户是否存在
        if (!currentUser && type === USER_EMAIL_TYPE.PASSWORD_RESET) throw new FailException(ERROR_CODE.USER.USER_NOT_EXISTS);

        // 生成验证码
        const code = generateCode();
        // 生成邮件内容
        const [subject, html] =
            type === USER_EMAIL_TYPE.PASSWORD_RESET ? createModifyPasswordCodeHtml(code, email) : createRegisterCodeHtml(code, email);

        await this.redisService.set(userRegisterEmailPrefix(type, email), code, EMAIL_VALIDITY_PERIOD);

        // 发送邮件
        await this.emailerService.sendEmail({
            subject,
            to: email,
            html,
        });
    }

    /**
     * 注册用户
     * @param email
     * @param password
     * @param code
     */
    public async registerUser(email: string, password: string, code: string): Promise<void> {
        //验证注册时邮箱验证码的正确性
        const emailCode = await this.redisService.get<string>(userRegisterEmailPrefix(USER_EMAIL_TYPE.REGISTER, email));

        if (!emailCode || emailCode !== code) throw new FailException(ERROR_CODE.USER.USER_EMAIL_CODE_ERROR);

        // 查询email存在的用户
        const currentUser = await this.userRepository.findOneBy({ email });

        // 如果用户名或者邮箱已经存在
        if (currentUser) throw new FailException(ERROR_CODE.USER.USER_EMAIL_EXISTS);

        const salt = this.configService.get('app.userPwdSalt') || '';

        const passwordHash = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            username: email,
            password: passwordHash,
            email,
        });

        await this.userRepository.save(user);
    }

    /**
     * 修改用户密码
     * @param email
     * @param password
     * @param code
     */
    public async modifyUserPassword(email: string, password: string, code: string): Promise<void> {
        // 获取缓存中存储的code
        const storeCode = await this.redisService.get<string>(userRegisterEmailPrefix(USER_EMAIL_TYPE.PASSWORD_RESET, email));

        if (!storeCode || storeCode !== code) throw new FailException(ERROR_CODE.USER.USER_EMAIL_CODE_ERROR);

        const targetUser = await this.userRepository.findOneBy({ email });
        if (!targetUser) throw new FailException(ERROR_CODE.USER.USER_NOT_EXISTS);

        const salt = this.configService.get('app.userPwdSalt') || '';
        targetUser.password = await bcrypt.hash(password, salt);

        await this.userRepository.save(targetUser);
        // 修改密码后，需要用户重新登录
        await this.redisService.delete(userLoginCachePrefix(targetUser.id, email));
    }

    /**
     * 创建验证码
     * @param width
     * @param height
     * @param size
     * @param fontSize
     * @param background
     * @returns
     */
    public async createCaptcha(
        width: number,
        height: number,
        size: number,
        fontSize: number,
        background: string,
    ): Promise<IUserCaptchaResponse> {
        const { text, data } = svgCaptcha.create({
            size,
            fontSize,
            width,
            height,
            background,
        });

        const captchaId = v4();

        await this.redisService.set(userLoginCaptchaPrefix(captchaId), text.toLocaleLowerCase(), USER_CAPTCHA_EXPIRE);

        const dataSvgImg = `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`;

        return {
            hashId: captchaId,
            captcha: dataSvgImg,
        };
    }

    /**
     * 用户登录
     * @param loginInfo
     * @returns
     */
    public async login(loginInfo: UserLoginDto): Promise<IUserLoginResponse> {
        const { email, password, hashId, code } = loginInfo;

        // 比对登录验证码
        const captchaKey = userLoginCaptchaPrefix(hashId);
        const storeLoginCaptcha = await this.redisService.get<string>(captchaKey);
        if (!storeLoginCaptcha || storeLoginCaptcha !== code) throw new FailException(ERROR_CODE.USER.USER_CAPTCHA_ERROR);

        // 查询用户以及相关的角色
        const subQuery = this.dataSource
            .createQueryBuilder(UserRole, 'ur')
            .select(['ur.userId AS userId', 'GROUP_CONCAT(ur.role) AS roles'])
            .groupBy('ur.userId')
            .getQuery();

        const currentUser = await this.userRepository
            .createQueryBuilder('user')
            .select([
                'user.id AS id',
                'user.username AS username',
                'user.password AS password',
                'user.status AS status',
                'ur.roles AS roles',
            ])
            .leftJoin(`(${subQuery})`, 'ur', 'ur.userId=user.id')
            .where('user.email=:email', { email })
            .getRawOne();

        // 如果用户不存在或者密码错误，则不允许进行登录
        if (!currentUser || !(await bcrypt.compare(password, currentUser.password)))
            throw new FailException(ERROR_CODE.USER.USER_LOGIN_ERROR);

        const { id, username, status, roles } = currentUser;

        // 如果用户的状态不正常，那么也不允许正常登录
        if (status !== USER_STATUS.NORMAL) throw new FailException(ERROR_CODE.USER.USER_STATUS_FORBIDDEN);

        // 返回服务端的token
        const token = this.authService.genToken({ id, username, email });

        // 如果不配置，那么则不设置过期时间
        const expireTime = this.configService.get<number>('app.loginExpiresIn');

        // 需要把相关的信息存入到redis数据库中, 并且设置过期时间
        await this.redisService.set(
            userLoginCachePrefix(id, email),
            {
                id,
                username,
                email,
                roleIds: roles ? roles.split(',').map((item: string) => Number(item)) : [],
                token,
            },
            expireTime,
        );

        // 删除已验证的验证码
        await this.redisService.delete(captchaKey);

        return {
            token,
        };
    }

    /**
     * 用户登出
     * @param id
     * @param email
     */
    public async logout(id: number, email: string): Promise<void> {
        const redisHandle = userLoginCachePrefix(id, email);

        await this.redisService.delete(redisHandle);
    }

    /**
     * 查询用户信息
     * @param userId
     * @returns
     */
    public async queryUserProfile(userId: number): Promise<IUserInfo> {
        const userProfile = await this.userRepository.findOne({
            select: ['id', 'username', 'email', 'avatar'],
            where: { id: userId },
        });

        if (!userProfile) throw new FailException(ERROR_CODE.USER.USER_PROFILE_ERROR);

        return {
            ...userProfile,
        };
    }
}
