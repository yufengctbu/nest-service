import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@app/entities';

import { FailException } from '@app/exceptions/fail.exception';
import { ERROR_CODE } from '@app/constants/error-code.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    public constructor(
        private configService: ConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    public async registerUser(username: string, password: string, email: string): Promise<void> {
        const currentUser = await this.userRepository.findOne({
            where: [{ username }, { email }],
        });

        // 如果用户名或者邮箱已经存在
        if (currentUser) throw new FailException(ERROR_CODE.USER.USER_ALREADY_EXISTS);

        const salt = this.configService.get('app.userPwdSalt') || '';

        const passwordHash = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            username,
            password: passwordHash,
            email,
        });

        await this.userRepository.save(user);
    }
}
