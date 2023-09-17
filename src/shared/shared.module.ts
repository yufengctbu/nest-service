import { Module } from '@nestjs/common';
import { LogModule } from './log/log.module';
import { MysqlModule } from './mysql/mysql.module';
import { RedisModule } from './redis/redis.module';

@Module({
    imports: [LogModule, MysqlModule, RedisModule],
})
export class SharedModule {}
