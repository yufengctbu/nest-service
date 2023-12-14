import { FileLogger } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Logger, createLogger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { IMysqlLogConfig } from './mysql.interface';

@Injectable()
export class MysqlFileLog extends FileLogger {
    private instance: Logger;
    private mysqlConfig: Omit<IMysqlLogConfig, 'loggerOptions'>;

    public constructor(mysqlConfig: IMysqlLogConfig) {
        const loggerOptions = mysqlConfig.loggerOptions || false;
        super(loggerOptions);

        if (typeof loggerOptions !== 'boolean' || loggerOptions) {
            this.formatMysqlConfig(mysqlConfig);
            this.instance = this.initFileInstance();
        }
    }

    // 格式化配置
    private formatMysqlConfig(mysqlConfig: IMysqlLogConfig): void {
        this.mysqlConfig = Object.assign(
            {
                dir: 'logs',
                filename: 'mysql',
                maxSize: '20m', // 每个日志文件的最大大小
                maxFiles: '15d', // 保留的日志文件数
            },
            mysqlConfig,
        );
    }

    private initFileInstance(): Logger {
        const { dir, filename, maxFiles, maxSize } = this.mysqlConfig;

        const defaultConfig = {
            auditFile: `${dir}/${filename}-audit.log`,
            filename: `${dir}/${filename}.%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            maxSize, // 每个日志文件的最大大小
            maxFiles, // 保留的日志文件数
        };

        return createLogger({
            transports: new DailyRotateFile(defaultConfig),
        });
    }

    public write(strings: string | string[]): void {
        strings = Array.isArray(strings) ? strings : [strings];

        const logContent = strings.map((str) => '[' + new Date().toLocaleString() + ']' + str).join('\r\n') + '\r\n';

        this.instance.log('info', logContent);
    }
}
