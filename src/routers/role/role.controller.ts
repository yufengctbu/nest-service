import { Controller, Get, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleListDto } from './role.dto';

@Controller('role')
export class RoleController {
    public constructor(private readonly roleService: RoleService) {}

    // 获取角色列表
    @Get()
    public async roleList(@Query() queryInfo: RoleListDto) {
        return this.roleService.queryRoleList(queryInfo);
    }
}
