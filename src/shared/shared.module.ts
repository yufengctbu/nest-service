import { Module } from '@nestjs/common';
import { LogModule } from './log/log.module';
import { MysqlModule } from './mysql/mysql.module';

@Module({
    imports: [LogModule, MysqlModule],
})
export class SharedModule {}
