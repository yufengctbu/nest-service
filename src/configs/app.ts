import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: parseInt(process.env.APP_PORT || '3000', 10), // 应用的端口

    paramsError: true, //是否展示参数验证的错误信息
}));
