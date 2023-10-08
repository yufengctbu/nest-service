import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, RoleListDto } from './role.dto';

@Controller('role')
export class RoleController {
    public constructor(private readonly roleService: RoleService) {}

    // 获取角色列表
    @Get()
    public async roleList(@Query() queryInfo: RoleListDto) {
        return this.roleService.queryRoleList(queryInfo);
    }

    // 添加角色
    @Post()
    public async addRole(@Body() roleInfo: CreateRoleDto) {
        const { name, desc = '' } = roleInfo;

        await this.roleService.createRole(name, desc);
    }
}
