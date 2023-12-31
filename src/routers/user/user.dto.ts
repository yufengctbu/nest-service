import { Transform, Type } from 'class-transformer';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length, Matches } from 'class-validator';

import {
    USER_CAPTCHA_BACKGROUND,
    USER_CAPTCHA_FONT_SIZE,
    USER_CAPTCHA_HEIGHT,
    USER_CAPTCHA_SIZE,
    USER_CAPTCHA_WIDTH,
    USER_EMAIL_TYPE,
} from './user.constant';

export class UserDto {
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    @IsNotEmpty()
    id: number;

    @Length(1, 30)
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    username: string;

    @Length(6, 30)
    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}

// 生成邮件验证码(注册与更改密码)
export class GenerateCodeDto extends PickType(UserDto, ['email'] as const) {
    @IsIn(Object.values(USER_EMAIL_TYPE))
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    type: number = USER_EMAIL_TYPE.REGISTER;
}

// 注册用户
export class RegisterUserDto extends OmitType(UserDto, ['id', 'username'] as const) {
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    code: string;
}

// 用户修改密码
export class ModifyUserPwdDto extends RegisterUserDto {}

// 用户登录
export class UserLoginDto extends PickType(UserDto, ['email', 'password'] as const) {
    @Transform(({ value }) => value.toString().trim())
    @IsNotEmpty()
    hashId: string;

    @Transform(({ value }) => value.toString().toLowerCase())
    @IsString()
    @IsNotEmpty()
    code: string;
}

// 验证码的配置
export class CaptchaInfoDto {
    @Transform(({ value }) => value.toString().trim())
    @IsOptional()
    hashId: string = '';

    // 图片的宽度
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    w: number = USER_CAPTCHA_WIDTH;

    // 图片的高度
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    h: number = USER_CAPTCHA_HEIGHT;

    // 验证码的位数
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    s: number = USER_CAPTCHA_SIZE;

    //字体的大小
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    fs: number = USER_CAPTCHA_FONT_SIZE;

    @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    @Transform(({ value }) => `#${value}`)
    @IsOptional()
    bg: string = USER_CAPTCHA_BACKGROUND;
}
