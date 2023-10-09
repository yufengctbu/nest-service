import { Transform, Type } from 'class-transformer';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsDefined, IsEmail, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, Length, Matches } from 'class-validator';

import {
    USER_CAPTCHA_BACKGROUND,
    USER_CAPTCHA_FONT_SIZE,
    USER_CAPTCHA_HEIGHT,
    USER_CAPTCHA_SIZE,
    USER_CAPTCHA_WIDTH,
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

// 生成邮件验证码
export class GenerateCodeDto extends PickType(UserDto, ['email'] as const) {}

// 注册用户
export class RegisterUserDto extends OmitType(UserDto, ['id', 'username'] as const) {
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    code: string;
}

// 用户登录
export class UserLoginDto extends PickType(UserDto, ['email', 'password'] as const) {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    hashId: string;

    @Transform(({ value }) => value.toString().toLowerCase())
    @IsString()
    @IsNotEmpty()
    code: string;
}

// 验证码的配置
export class CaptchaInfoDto {
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

// 给用户分配角色
export class AssignUserRolesDto {
    // 用户id
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    @IsNotEmpty()
    uid: number;

    // 角色id,多个角色id中间用,隔开
    @Transform(({ value }) => value.trim())
    @Type(() => String)
    @IsDefined()
    roles: string;
}
