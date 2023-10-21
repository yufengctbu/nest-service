export enum USER_STATUS {
    FORBID, // 禁止状态

    NORMAL, // 正常状态
}

export enum USER_ADMIN {
    NORMAL, // 普通用户

    ADMIN, // 管理员用户
}

// 发送邮件的类别
export enum USER_EMAIL_TYPE {
    REGISTER, // 注册

    PASSWORD_RESET, // 密码重置
}

export const USER_CAPTCHA_WIDTH = 100;
export const USER_CAPTCHA_HEIGHT = 34;
export const USER_CAPTCHA_SIZE = 4;
export const USER_CAPTCHA_FONT_SIZE = 50;
export const USER_CAPTCHA_BACKGROUND = '#cc9966';
export const USER_CAPTCHA_EXPIRE = 5 * 60;
