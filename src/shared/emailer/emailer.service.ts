import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { FailException } from '@app/exceptions/fail.exception';
import { ERROR_CODE } from '@app/constants/error-code.constant';
import { IEmailContentOption } from './emailer.interface';

@Injectable()
export class EmailerService {
    // 当前emailerValid是否可用
    private emailerHandle: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;

    public constructor(private configService: ConfigService) {
        this.emailerInit();
    }

    // 初始化邮件发送组件
    private emailerInit(): void {
        const { host, port, sourceEmail, authCode } = this.configService.get('emailer');

        // 如果没有配置emailer的基础配置，该功能不可用
        if (!host || !sourceEmail || !authCode) return;

        this.emailerHandle = nodemailer.createTransport({
            host,
            port,
            secure: port === 465, // true for 465, false for other ports
            auth: {
                user: sourceEmail,
                pass: authCode,
            },
        });
    }

    public async sendEmail(option: IEmailContentOption): Promise<void> {
        if (!this.emailerHandle) throw new FailException(ERROR_CODE.SERVICE.EMAIL_CONFIG_ERROR);

        console.log(option);
    }
}
