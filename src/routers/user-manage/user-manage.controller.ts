import { Controller, Get, Post, Body } from '@nestjs/common';

import { AssignUserRolesDto } from './user-manage.dto';
import { UserManageService } from './user-manage.service';

@Controller('user-manage')
export class UserManageController {
    public constructor(private readonly userManageService: UserManageService) {}

    @Get('list')
    public queryUserList() {}

    // 给用户分配角色
    @Post('assign-roles')
    public async assignUserRoles(@Body() assignRoleInfo: AssignUserRolesDto) {
        const { uid, roles } = assignRoleInfo;

        await this.userManageService.distributeUserRoles(uid, roles);
    }
}
