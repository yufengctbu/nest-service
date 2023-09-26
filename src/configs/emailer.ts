import { registerAs } from '@nestjs/config';

const env = process.env;

export default registerAs('emailer', () => ({
    host: env.EMAIL_HOST || '', // 邮箱服务器， 需要开户 IMAP/SMTP服务

    port: env.EMAIL_PORT || 465,

    sourceEmail: env.EMAIL_SOURCE_EMAIL || '', // 用于发邮件的邮箱

    authCode: env.EMAIL_AUTH_CODE || '', // 授权码
}));
