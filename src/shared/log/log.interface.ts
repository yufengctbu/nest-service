// 文件日志配置
export interface IFileConfig {
    dir: string; // 日志保存的文件夹
    filename: string; // 日志的文件名
    maxSize: string; // 每个日志文件的最大大小
    maxFiles: string; // 保留的日志文件数
}

export interface IWinstonLogger {
    log: (message: any, context?: string) => any;
}
