import safeStringify from 'fast-safe-stringify';
import { Request, Response, NextFunction } from 'express';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';

import { IWinstonLogger, WINSTON_LOG } from '@app/shared/log';

@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
    public constructor(@Inject(WINSTON_LOG) private readonly winstonLogService: IWinstonLogger) {}

    use(req: Request, res: Response, next: NextFunction) {
        const reqContent = safeStringify({
            requestId: req.requestId,
            method: req.method,
            ip: req.ip,
            url: req.url,
            headers: req.headers,
            body: req.body,
            params: req.params,
            query: req.query,
            time: new Date().toLocaleString(),
        });

        // 把请求的信息写入日志
        this.winstonLogService.log(reqContent);
        next();
    }
}
