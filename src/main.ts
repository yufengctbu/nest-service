import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@app/app.module';
import { JwtAuthGuard } from '@app/guards/auth.guard';
import { LogModule, LogFileService } from '@app/shared/log';
import { validationHelper } from '@app/helpers/validate.helper';
import { ExceptionsFilter } from '@app/filters/exception.filter';
import { RequestIdMiddleware } from '@app/middlewares/requestId.middleware';
import { TransformInterceptor } from '@app/interceptors/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: LogModule.createLogger(),
    });

    const config = app.get(ConfigService);

    // 往所有的请求中添加requestId的标识
    app.use(RequestIdMiddleware);

    // 配置请求头的过滤
    app.use(helmet());

    // 启用压缩中间件进行gzip压缩
    app.use(compression());

    // 注册全局过滤器
    app.useGlobalPipes(validationHelper(config.get('app.paramsError')));

    const logFileService = app.get(LogFileService);

    // 使用全局的错误过滤器
    app.useGlobalFilters(new ExceptionsFilter(logFileService, config));

    // 使用全局的数据拦截器
    app.useGlobalInterceptors(new TransformInterceptor(logFileService, config));

    // 使用全局守卫
    app.useGlobalGuards(new JwtAuthGuard());

    // 获取配置中的端口启动服务
    const port = config.get('app.port');

    await app.listen(port, () => {
        Logger.log(`service starts, port ${port}`);
    });
}

bootstrap();
