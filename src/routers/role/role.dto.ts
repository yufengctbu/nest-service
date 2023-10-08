import { PaginationDto } from '@app/dtos/pagination.dto';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';

export class RoleListDto extends PaginationDto {}

export class CreateRoleDto {
    @Length(1, 60)
    @Transform(({ value }) => value.trim())
    @Type(() => String)
    @IsNotEmpty()
    name: string;

    @Length(0, 200)
    @IsNotEmpty()
    desc: string;
}
