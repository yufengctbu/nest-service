import helmet from 'helmet';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@app/app.module';
import { ExceptionsFilter } from '@app/filters/exception.filter';
import { RequestIdMiddleware } from '@app/middlewares/requestId.middleware';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 往所有的请求中添加requestId的标识
    app.use(RequestIdMiddleware);

    // 配置请求头的过滤
    app.use(helmet());

    // 启用压缩中间件进行gzip压缩
    app.use(compression);

    app.useGlobalFilters(new ExceptionsFilter());

    // 获取配置中的端口启动服务
    const port = app.get(ConfigService).get('app.port');

    await app.listen(port, () => {
        console.log('服务器启动成功');
    });
}
bootstrap();
