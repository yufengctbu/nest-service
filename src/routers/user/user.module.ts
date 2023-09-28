import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@app/entities';
import { UserService } from './user.service';
import { RedisModule } from '@app/shared/redis';
import { UserController } from './user.controller';
import { EmailerModule } from '@app/shared/emailer';

@Module({
    imports: [TypeOrmModule.forFeature([User]), RedisModule, EmailerModule],

    controllers: [UserController],

    providers: [UserService],
})
export class UserModule {}
