import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import safeStringify from 'fast-safe-stringify';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { IWinstonLogger } from '@app/shared/log';
import { SERVICE_ERROR_TEXT } from '@app/constants/http.constant';
import { ERROR_CODE } from '@app/constants/error-code.constant';
import { CustomException } from '@app/exceptions/custom.exception';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    private consoleErrorLog: boolean;

    public constructor(
        private readonly winstonLogService: IWinstonLogger,
        private readonly configService: ConfigService,
    ) {
        this.consoleErrorLog = this.configService.get('app.logs.consoleErrorLog') || false;
    }

    public catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        // 获取每个请求的requestId
        const requestId = request.requestId;

        let res = exception.getResponse
            ? exception.getResponse()
            : {
                  status,

                  message: exception instanceof CustomException ? exception.message : SERVICE_ERROR_TEXT,

                  errno: ERROR_CODE.SERVICE.SERVICE_ERROR,
              };

        // 如果是字符串，那么需要构建json
        if (typeof res === 'string')
            res = {
                status,

                message: res,

                errno: ERROR_CODE.SERVICE.SERVICE_ERROR,
            };

        const content = Object.keys(res)
            .filter((item) => res[item])
            .map((item) => `${item}: ${safeStringify(res[item])}`)
            .join(' ');

        const message = `requestId: ${requestId} level: 'error' ${content} stack: ${safeStringify(exception.stack || '')}`;

        this.winstonLogService.log(message);

        Object.assign(res, { requestId });

        // 如果需要在控制台输出错误的信息
        if (this.consoleErrorLog) Logger.error(res, exception.stack);

        response.status(status).json(res);
    }
}
