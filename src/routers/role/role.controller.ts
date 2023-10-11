import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';

import { RoleService } from './role.service';
import { CreateRoleDto, ModifyRoleDto, RoleListDto } from './role.dto';

@Controller('role')
export class RoleController {
    public constructor(private readonly roleService: RoleService) {}

    // 获取角色列表
    @Get('list')
    public async roleList(@Query() queryInfo: RoleListDto) {
        return this.roleService.queryRoleList(queryInfo);
    }

    // 添加角色
    @Post()
    public async addRole(@Body() roleInfo: CreateRoleDto) {
        const { name, desc = '' } = roleInfo;

        await this.roleService.createRole(name, desc);
    }

    // 修改角色信息
    @Put()
    public async modifyRole(@Body() roleInfo: ModifyRoleDto) {
        const { id, name, desc } = roleInfo;

        await this.roleService.modifyRole(id, name, desc);
    }

    // TODO:删除角色
}
