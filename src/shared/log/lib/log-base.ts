import { Logger } from 'winston';

import { IWinstonLogger } from '../log.interface';
import { WINSTON_LOG_LEVEL } from '../log.constant';
import { ConfigService } from '@nestjs/config';

export abstract class LogBase implements IWinstonLogger {
    protected instance: Logger;

    public constructor(configService: ConfigService) {
        this.instance = this.initLogInstance(configService);
    }

    protected abstract initLogInstance(configService: ConfigService): Logger;

    protected logWithMeta(level: string, message: string, context?: string, meta?: any): void {
        this.instance.log({ level, message, context, ...meta });
    }

    public log(message: any, context?: string): any {
        if (message && typeof message === 'object') {
            const { message: msg, level = WINSTON_LOG_LEVEL, ...meta } = message;
            this.logWithMeta(level, msg, context, meta);
        } else {
            this.logWithMeta(WINSTON_LOG_LEVEL, message, context);
        }
    }
}
