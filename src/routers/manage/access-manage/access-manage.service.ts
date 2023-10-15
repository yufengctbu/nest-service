import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Access, AccessCategory } from '@app/entities';
import { AccessCategoryListDto } from './access-manage.dto';
import { FailException } from '@app/exceptions/fail.exception';
import { ERROR_CODE } from '@app/constants/error-code.constant';

@Injectable()
export class AccessManageService {
    public constructor(
        @InjectRepository(Access) private readonly accessRepository: Repository<Access>,
        @InjectRepository(AccessCategory) private readonly accessCategoryRepository: Repository<AccessCategory>,
    ) {}

    public async queryAccessCategoryList(accessCategoryListInfo: AccessCategoryListDto) {
        console.log(accessCategoryListInfo);
    }

    /**
     * 创建新的类别
     * @param name
     * @param description
     */
    public async createAccessCategory(name: string, description: string): Promise<void> {
        // 查询指定的类别是否已存在
        const currentRecord = await this.accessCategoryRepository.findOneBy({ name });

        if (currentRecord) throw new FailException(ERROR_CODE.COMMON.RECORD_EXITS);

        const categoryRecord = this.accessCategoryRepository.create({
            name,
            description,
        });

        await this.accessCategoryRepository.save(categoryRecord);
    }

    /**
     * 修改类别的相关信息
     * @param id
     * @param name
     * @param desc
     */
    public async modifyAccessCategory(id: number, name: string, desc: string): Promise<void> {
        const targetCategory = await this.accessCategoryRepository.findOneBy({ id });

        if (!targetCategory) throw new FailException(ERROR_CODE.COMMON.RECORD_NOT_EXISTS);

        targetCategory.name = name;
        targetCategory.description = desc;

        await this.accessCategoryRepository.save(targetCategory);
    }
}
