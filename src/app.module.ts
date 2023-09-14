import { ConfigModule } from '@nestjs/config';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { appConfig, databaseConfig } from '@app/configs';
import { RoutersModule } from '@app/routers/routers.module';
import { SharedModule } from '@app/shared/shared.module';
import { RequestLogMiddleware } from '@app/middlewares/request-log.middleware';

@Module({
    imports: [
        // 配置全局通用配置
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, databaseConfig],
        }),

        // 加载路由模块
        RoutersModule,

        // 封装的公用功能模块
        SharedModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        // 进行日志中间件的处理
        consumer.apply(RequestLogMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
