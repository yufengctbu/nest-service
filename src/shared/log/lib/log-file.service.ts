import { ConfigService } from '@nestjs/config';
import { Logger, createLogger, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { LogBase } from './log-base';
import { WINSTON_LOG_LEVEL } from '../log.constant';
import { winstonLogLevels, nestConsoleFormat } from '../log.helper';

export class LogFileService extends LogBase {
    public constructor(configService: ConfigService) {
        super(configService);
    }

    protected initLogInstance(configService: ConfigService): Logger {
        const maxSize = configService.get('app.logs.maxSize') || '20m';
        const maxFiles = configService.get('app.logs.maxFiles') || '12d';

        const defaultConfig = {
            level: WINSTON_LOG_LEVEL, // 写入文件的日志级别
            auditFile: 'logs/http-audit.log',
            filename: 'logs/http.%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize, // 每个日志文件的最大大小
            maxFiles, // 保留的日志文件数
        };

        return createLogger({
            levels: winstonLogLevels,
            format: format.combine(format.simple(), format.timestamp(), nestConsoleFormat()),
            transports: [new DailyRotateFile(defaultConfig)],
        });
    }
}
