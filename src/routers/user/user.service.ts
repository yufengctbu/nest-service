import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@app/entities';
import { RedisService } from '@app/shared/redis';
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
        // 查询email存在的用户
        const currentUser = await this.userRepository.findOneBy({ email });

        // 如果用户名或者邮箱已经存在
        if (currentUser) throw new FailException(ERROR_CODE.USER.USER_EMAIL_EXISTS);

        const emailCode = await this.redisService.get<string>(userRegisterEmailPrefix(email));

        if (!emailCode || emailCode !== code) throw new FailException(ERROR_CODE.USER.USER_EMAIL_CODE_ERROR);

        const salt = this.configService.get('app.userPwdSalt') || '';

        const passwordHash = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            username: email,
            password: passwordHash,
            email,
        });

        await this.userRepository.save(user);
    }
}
