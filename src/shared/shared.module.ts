import { Module } from '@nestjs/common';
import { LogModule } from './log/log.module';
import { MysqlModule } from './mysql/mysql.module';
import { RedisModule } from './redis/redis.module';
import { EmailerModule } from './emailer/emailer.module';

@Module({
    imports: [LogModule, MysqlModule, RedisModule, EmailerModule],
})
export class SharedModule {}
