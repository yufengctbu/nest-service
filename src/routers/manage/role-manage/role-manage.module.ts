import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '@app/entities';
import { RoleManageService } from './role-manage.service';
import { RoleManageController } from './role-manage.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    controllers: [RoleManageController],
    providers: [RoleManageService],
})
export class RoleManageModule {}
