import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from '@app/entities';

import { RoleListDto } from './role-manage.dto';
import { IRoleListResponse } from './role-manage.interface';
import { FailException } from '@app/exceptions/fail.exception';
import { ERROR_CODE } from '@app/constants/error-code.constant';

@Injectable()
export class RoleManageService {
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
        if (page && pageSize) handle = handle.skip((page - 1) * pageSize).take(pageSize);

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

    /**
     * 修改角色信息
     * @param id
     * @param name
     * @param description
     */
    public async modifyRole(id: number, name: string, description: string): Promise<void> {
        const targetRole = await this.roleRepository.findOneBy({ id });

        // 如果不存在说明角色不存在
        if (!targetRole) throw new FailException(ERROR_CODE.COMMON.RECORD_NOT_EXISTS);

        targetRole.name = name;
        targetRole.description = description;

        await this.roleRepository.save(targetRole);
    }
}
