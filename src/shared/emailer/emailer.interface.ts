export interface IEmailContentOption {
    subject: string; // 邮件标题

    to: Array<string> | string; //邮件接收邮箱地址

    text?: string; // 邮件内容的text

    html?: string; // 邮件内容的html格式
}
