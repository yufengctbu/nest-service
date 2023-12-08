import { Observable, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import safeStringify from 'fast-safe-stringify';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { IWinstonLogger } from '@app/shared/log';
import { customResponse } from '@app/helpers/response.helper';
import { IsOriginResponse } from '@app/helpers/reflector-validate.helper';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    private responseLog: boolean;

    public constructor(
        private readonly winstonLogService: IWinstonLogger,
        private readonly configService: ConfigService,
    ) {
        this.responseLog = this.configService.get('app.logs.responseLog') || false;
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                if (IsOriginResponse(context.getHandler())) return data;

                const requestId = context.switchToHttp().getRequest().requestId;

                const result = customResponse(data, requestId);

                if (this.responseLog) this.winstonLogService.log(safeStringify(result));

                return result;
            }),
        );
    }
}
