import { Module } from '@nestjs/common';

import { UserModule } from './user';
import { AuthModule } from './auth';
import { RoleModule } from './role';
import { AccessModule } from './access';

@Module({
    imports: [AuthModule, UserModule, RoleModule, AccessModule],
})
export class RoutersModule {}
