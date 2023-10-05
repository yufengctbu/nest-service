import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@app/entities';
import { USER_STATUS } from './user.constant';
import { AuthService } from '@app/routers/auth';
import { RedisService } from '@app/shared/redis';
import { IUserLoginResponse } from './user.interface';
import { userRegisterEmailPrefix } from './user.helper';
import { generateCode } from '@app/helpers/utils.helper';
import { FailException } from '@app/exceptions/fail.exception';
import { ERROR_CODE } from '@app/constants/error-code.constant';
import { createCodeHtml, EmailerService } from '@app/shared/emailer';
import { EMAIL_VALIDITY_PERIOD } from '@app/constants/common.constant';

@Injectable()
export class UserService {
    public constructor(
        private redisService: RedisService,
        private configService: ConfigService,
        private emailerService: EmailerService,
        private authService: AuthService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    /**
     * 生成注册的验证码
     * @param email
     */
    public async generateCode(email: string): Promise<void> {
        const currentUser = await this.userRepository.findOneBy({ email });

        // 如果当前的邮件已经被注册
        if (currentUser) throw new FailException(ERROR_CODE.USER.USER_EMAIL_EXISTS);

        // 生成验证码
        const code = generateCode();
        // 生成邮件内容
        const [subject, html] = createCodeHtml(code, email);

        await this.redisService.set(userRegisterEmailPrefix(email), code, EMAIL_VALIDITY_PERIOD);

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
        //验证邮箱验证码的正确性
        const emailCode = await this.redisService.get<string>(userRegisterEmailPrefix(email));

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

    public async login(email: string, password: string): Promise<IUserLoginResponse> {
        const currentUser = await this.userRepository.findOne({
            select: ['id', 'username', 'password', 'status'],
            where: { email },
        });

        // 如果用户不存在或者密码错误，则不允许进行登录
        if (!currentUser || !(await bcrypt.compare(password, currentUser.password)))
            throw new FailException(ERROR_CODE.USER.USER_LOGIN_ERROR);

        const { id, username, status } = currentUser;

        // 如果用户的状态不正常，那么也不允许正常登录
        if (status !== USER_STATUS.NORMAL) throw new FailException(ERROR_CODE.USER.USER_STATUS_FORBIDDEN);

        // 返回服务端的token
        const token = this.authService.genToken({ id, username, email });

        return {
            token,
        };
    }
}
