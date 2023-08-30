import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@app/configs';
import { RoutersModule } from './routers/routers.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        // 配置全局通用配置
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
        }),

        // 加载路由模块
        RoutersModule,

        // 封装的公用功能模块
        SharedModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
