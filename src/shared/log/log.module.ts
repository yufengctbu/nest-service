import { Module, Global } from '@nestjs/common';
import { LogService } from './log.service';

@Global()
@Module({
    providers: [LogService],
})
export class LogModule {
    // 导出日志的实例
    public static createLogger(): LogService {
        return new LogService();
    }
}
