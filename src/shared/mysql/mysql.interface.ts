export type LogLevel = 'query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration';

export interface IMysqlLogConfig {
    dir: string;
    filename: string;
    maxSize: string; // 每个日志文件的最大大小
    maxFiles: string; // 保留的日志文件数

    // typeorm的log值有分成 boolean | "all" | LogLevel[];
    // LogLevel = "query" | "schema" | "error" | "warn" | "info" | "log" | "migration";
    loggerOptions: boolean | 'all' | LogLevel[];
}
