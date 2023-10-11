import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { AccessModule } from './access/access.module';
import { UserManageModule } from './user-manage/user-manage.module';

@Module({
    imports: [AuthModule, UserModule, RoleModule, AccessModule, UserManageModule],
})
export class RoutersModule {}
