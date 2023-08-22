import { Request, Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

import { CustomException } from '@app/exceptions/custom.exception';
import { SERVICE_ERROR_TEXT } from '@app/constants/http.constant';
import { ERROR_CODE } from '@app/constants/error-code.constant';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    public catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        // 获取每个请求的requestId
        const requestId = request.requestId;

        const res = exception.getResponse
            ? exception.getResponse()
            : {
                  status,

                  message: exception instanceof CustomException ? exception.message : SERVICE_ERROR_TEXT,

                  errno: ERROR_CODE.SERVICE.SERVICE_ERROR,
              };

        Object.assign(res, { requestId });

        response.status(status).json(res);
    }
}
