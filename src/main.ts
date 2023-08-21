import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 获取配置中的端口启动服务
    const port = app.get(ConfigService).get('app.port');

    await app.listen(port, () => {
        console.log('服务器启动成功');
    });
}
bootstrap();
