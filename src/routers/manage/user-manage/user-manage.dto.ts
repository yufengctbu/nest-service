import { Transform, Type } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

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
