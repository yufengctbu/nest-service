import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@app/entities';
import { UserService } from './user.service';
import { RedisModule } from '@app/shared/redis';
import { UserController } from './user.controller';
import { EmailerModule } from '@app/shared/emailer';
import { AuthModule } from '@app/routers/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), AuthModule, RedisModule, EmailerModule],

    controllers: [UserController],

    providers: [UserService],
})
export class UserModule {}
