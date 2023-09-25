import { Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPositive, Length } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class UserDto {
    @IsPositive()
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

// 注册用户
export class RegisterUserDto extends OmitType(UserDto, ['id'] as const) {}
