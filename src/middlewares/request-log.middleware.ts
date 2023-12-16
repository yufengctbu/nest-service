import safeStringify from 'fast-safe-stringify';
import { Request, Response, NextFunction } from 'express';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';

import { IWinstonLogger, WINSTON_LOG } from '@app/shared/log';

@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
    public constructor(@Inject(WINSTON_LOG) private readonly winstonLogService: IWinstonLogger) {}

    use(req: Request, res: Response, next: NextFunction) {
        const message = `requestId: ${req.requestId} ip: ${req.ip} url: ${req.url} method: ${req.method} headers: ${safeStringify(
            req.headers,
        )} body: ${safeStringify(req.body)} params: ${safeStringify(req.params)} query: ${safeStringify(
            req.query,
        )} time: ${new Date().toLocaleString()}`;

        // 把请求的信息写入日志
        this.winstonLogService.log(message);
        next();
    }
}
