import { Logger, createLogger, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { LogBase } from './log-base';
import { IFileConfig } from '../log.interface';
import { WINSTON_LOG_LEVEL } from '../log.constant';
import { winstonLogLevels, nestConsoleFormat } from '../log.helper';

export class LogFileService extends LogBase {
    private formatLogConfig(fileConfig: IFileConfig): IFileConfig {
        return Object.assign(
            {
                dir: 'logs',
                filename: 'http',
                maxSize: '20m', // 每个日志文件的最大大小
                maxFiles: '12d', // 保留的日志文件数
            },
            fileConfig,
        );
    }

    protected initLogInstance(fileConfig: IFileConfig): Logger {
        const { dir, filename, maxSize, maxFiles } = this.formatLogConfig(fileConfig);

        const defaultConfig = {
            level: WINSTON_LOG_LEVEL, // 写入文件的日志级别
            auditFile: `${dir}/${filename}-audit.log`,
            filename: `${dir}/${filename}.%DATE%.log`,
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
