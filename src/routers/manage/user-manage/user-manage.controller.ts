import { Controller, Get, Post, Body, Query, Delete } from '@nestjs/common';

import { UserManageService } from './user-manage.service';
import { AssignUserRolesDto, RemoveUsersDto, UserListDto } from './user-manage.dto';

@Controller('user-manage')
export class UserManageController {
    public constructor(private readonly userManageService: UserManageService) {}

    // 查询用户列表
    @Get('list')
    public queryUserList(@Query() userListParam: UserListDto) {
        return this.userManageService.queryUserList(userListParam);
    }

    // 给用户分配角色
    @Post('assign-roles')
    public async assignUserRoles(@Body() assignRoleInfo: AssignUserRolesDto) {
        const { uid, roles } = assignRoleInfo;

        await this.userManageService.distributeUserRoles(uid, roles);
    }

    // 删除用户或者调整用户状态
    @Delete('delete')
    public async removeUser(@Body() removeUserInfo: RemoveUsersDto) {
        const { users, rigid } = removeUserInfo;

        await this.userManageService.removeUsers(users, rigid);
    }
}
