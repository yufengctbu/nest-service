import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { IEmailContentOption } from './emailer.interface';
import { FailException } from '@app/exceptions/fail.exception';
import { ERROR_CODE } from '@app/constants/error-code.constant';

@Injectable()
export class EmailerService {
    // 当前emailerValid是否可用
    private emailerHandle: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;
    // 邮件的发送者
    private originEmailer: string = '';

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

        this.originEmailer = sourceEmail;
    }

    // 邮件发送
    public async sendEmail(option: IEmailContentOption): Promise<void> {
        if (!this.emailerHandle) throw new FailException(ERROR_CODE.SERVICE.EMAIL_CONFIG_ERROR);

        if (!option.from) option.from = this.originEmailer;

        try {
            await this.emailerHandle.sendMail(option);
        } catch (err) {
            const exception = new FailException(ERROR_CODE.SERVICE.EMAIL_SEND_ERROR);

            // 抛出错误需要把stack给传递出去，方便进行排查
            if (err.stack) exception.stack = err.stack;

            throw exception;
        }
    }
}
