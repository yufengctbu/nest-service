import safeStringify from 'fast-safe-stringify';
import { Observable, map } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { LogFileService } from '@app/shared/log';
import { customResponse } from '@app/helpers/response.helper';
import { IsOriginResponse } from '@app/helpers/reflector-validate.helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    public constructor(
        private readonly logFileService: LogFileService,
        private readonly configService: ConfigService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                if (IsOriginResponse(context.getHandler())) return data;

                const requestId = context.switchToHttp().getRequest().requestId;

                const result = customResponse(data, requestId);

                const resLog = this.configService.get('app.logs.responseLog') || false;

                if (resLog) this.logFileService.file(safeStringify(result));

                return result;
            }),
        );
    }
}
