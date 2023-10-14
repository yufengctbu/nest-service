import { Controller, Get, Post, Body, Query, Delete } from '@nestjs/common';

import { UserManageService } from './user-manage.service';
import { AssignUserRolesDto, RemoveUsersDto, UserListDto } from './user-manage.dto';
import { User } from '@app/decorators/user.decorator';
import { IPayLoad } from '@app/shared/auth';

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
    public async assignUserRoles(@Body() assignRoleInfo: AssignUserRolesDto, @User() userInfo: IPayLoad) {
        const { uid, roles } = assignRoleInfo;

        await this.userManageService.distributeUserRoles(userInfo.id, uid, roles);
    }

    // 删除用户或者调整用户状态
    @Delete('delete')
    public async removeUser(@Body() removeUserInfo: RemoveUsersDto, @User() userInfo: IPayLoad) {
        const { users, rigid } = removeUserInfo;

        await this.userManageService.removeUsers(userInfo.id, users, rigid);
    }
}
