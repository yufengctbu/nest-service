import { Module } from '@nestjs/common';
import { LogModule } from './log/log.module';

@Module({
    imports: [LogModule],
})
export class SharedModule {}
