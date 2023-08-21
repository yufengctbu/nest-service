import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@app/configs';

@Module({
    imports: [
        // 配置全局通用配置
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
