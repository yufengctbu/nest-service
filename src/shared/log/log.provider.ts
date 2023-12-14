import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_LOG } from './log.constant';
import { LogFileService } from './lib/log-file.service';

export const winstonLogProvider: Provider = {
    provide: WINSTON_LOG,
    useFactory: (configService: ConfigService) => {
        const logConfig = configService.get('app.logs.config') || {};

        return new LogFileService(logConfig);
    },
    inject: [ConfigService],
};
