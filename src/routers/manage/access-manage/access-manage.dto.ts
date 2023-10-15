import { PaginationDto } from '@app/dtos/pagination.dto';
import { OmitType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length } from 'class-validator';

// 查询类别列表
export class AccessCategoryListDto extends PaginationDto {}

// 类别
export class AccessCategoryDto {
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    @IsNotEmpty()
    id: number;

    @Length(1)
    @Transform(({ value }) => value.trim())
    @Type(() => String)
    @IsNotEmpty()
    name: string;

    @IsString()
    @Type(() => String)
    @IsOptional()
    desc: string;
}

// 创建accessCategory
export class CreateAccessCategoryDto extends OmitType(AccessCategoryDto, ['id']) {}

// 修改accessCategory
export class ModifyAccessCategoryDto extends AccessCategoryDto {}
