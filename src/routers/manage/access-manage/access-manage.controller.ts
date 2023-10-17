import { Controller, Get, Post, Query, Body, Put } from '@nestjs/common';

import { AccessManageService } from './access-manage.service';
import {
    CreateAccessDto,
    ModifyAccessDto,
    AccessCategoryListDto,
    CreateAccessCategoryDto,
    ModifyAccessCategoryDto,
} from './access-manage.dto';

@Controller('access-manage')
export class AccessManageController {
    public constructor(private readonly accessManageService: AccessManageService) {}

    // 查询类别列表
    @Get('category-list')
    public getAccessCategoryList(@Query() accessCategoryListInfo: AccessCategoryListDto) {
        return this.accessManageService.queryAccessCategoryList(accessCategoryListInfo);
    }

    // 添加类别
    @Post('access-category')
    public async createAccessCategory(@Body() categoryInfo: CreateAccessCategoryDto) {
        const { name, desc = '' } = categoryInfo;

        await this.accessManageService.createAccessCategory(name, desc);
    }

    // 修改类别
    @Put('access-category')
    public async modifyAccessCategory(@Body() categoryInfo: ModifyAccessCategoryDto) {
        const { id, name, desc } = categoryInfo;

        await this.accessManageService.modifyAccessCategory(id, name, desc);
    }

    // 创建权限
    @Post('access')
    public async addAccess(@Body() accessInfo: CreateAccessDto) {
        await this.accessManageService.createAccess(accessInfo);
    }

    // 修改权限
    @Put('access')
    public async modifyAccess(@Body() accessInfo: ModifyAccessDto) {
        await this.accessManageService.modifyAccess(accessInfo);
    }
}
