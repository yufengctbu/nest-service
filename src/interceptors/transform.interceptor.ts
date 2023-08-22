import { Observable, map } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { customResponse } from '@app/helpers/response.helper';
import { IsOriginResponse } from '@app/helpers/reflector-validate.helper';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    public constructor() {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                if (IsOriginResponse(context.getHandler())) return data;

                const requestId = context.switchToHttp().getRequest().requestId;

                return customResponse(data, requestId);
            }),
        );
    }
}
