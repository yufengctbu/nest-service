import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@app/configs';
import { RoutersModule } from './routers/routers.module';

@Module({
    imports: [
        // 配置全局通用配置
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
        }),

        // 加载路由模块
        RoutersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
