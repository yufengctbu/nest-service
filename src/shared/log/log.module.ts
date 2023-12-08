import { Module, Global } from '@nestjs/common';

import { LogService } from './log.service';
import { winstonLogProvider } from './log.provider';

@Global()
@Module({
    providers: [winstonLogProvider],
    exports: [winstonLogProvider],
})
export class LogModule {
    // 导出日志的实例
    public static createLogger(): LogService {
        return new LogService();
    }
}
