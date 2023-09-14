import { registerAs } from '@nestjs/config';

const isDev = process.env.NODE_ENV === 'development';

export default registerAs('app', () => ({
    port: parseInt(process.env.APP_PORT || '3000', 10), // 应用的端口

    paramsError: isDev, //是否展示参数验证的错误信息

    // 日志部份配置
    logs: {
        responseLog: false, //是否把输出数据写入文件
        consoleErrorLog: isDev, // 如果是错误，是否在控制台打印
        maxSize: '20m', // 每个日志文件的最大大小
        maxFiles: '15d', // 保留的日志文件数
    },
}));
