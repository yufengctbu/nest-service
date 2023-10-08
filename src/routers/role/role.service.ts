import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from '@app/entities';
import { RoleListDto } from './role.dto';
import { IRoleListResponse } from './role.interface';
import { FailException } from '@app/exceptions/fail.exception';
import { ERROR_CODE } from '@app/constants/error-code.constant';

@Injectable()
export class RoleService {
    public constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

    /**
     * 请求角色列表
     * @param queryInfo
     * @returns
     */
    public async queryRoleList(queryInfo: RoleListDto): Promise<IRoleListResponse> {
        const { page, pageSize, q } = queryInfo;

        let handle = this.roleRepository.createQueryBuilder('role').select(['role.id', 'role.name', 'role.description']);

        // 进行关键字的模糊查询
        if (q) handle = handle.where('role.name LIKE :query', { query: `%${q}%` });

        // 分页处理
        if (page && pageSize) handle = handle.skip((page - 1) * pageSize).take(page);

        const [roles, count] = await handle.getManyAndCount();

        return {
            count,
            roles,
            pagination: {
                page: page ?? 1,
                pageSize: pageSize ?? count,
            },
        };
    }

    /**
     * 创建新角色
     * @param name
     * @param description
     */
    public async createRole(name: string, description: string): Promise<void> {
        const currentRole = await this.roleRepository.findOne({
            select: ['id'],
            where: { name },
        });

        if (currentRole) throw new FailException(ERROR_CODE.COMMON.RECORD_EXITS);

        const roleInfo = this.roleRepository.create({
            name,
            description,
        });

        await this.roleRepository.save(roleInfo);
    }
}
