import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In, EntityManager } from 'typeorm';

import { User, Role, UserRole } from '@app/entities';
import { ERROR_CODE } from '@app/constants/error-code.constant';
import { FailException } from '@app/exceptions/fail.exception';

@Injectable()
export class UserManageService {
    public constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    /**
     * 给用户分配角色
     * @param uid
     * @param roles
     */
    public async distributeUserRoles(uid: number, roles: string = ''): Promise<void> {
        const targetUser = await this.userRepository.findOne({
            select: ['id'],
            where: { id: uid },
        });

        if (!targetUser) throw new FailException(ERROR_CODE.USER.USER_NOT_EXISTS);

        const rolesId = roles.split(',').map((item) => Number(item));

        const roleList = await this.dataSource.getRepository(Role).findBy({ id: In(rolesId) });

        // 删除掉该用户的所有信息再进行授角
        await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
            await transactionalEntityManager.delete(UserRole, { userId: uid });

            if (roleList.length > 0) {
                const relations = roleList.map((item: Role) =>
                    transactionalEntityManager.create(UserRole, {
                        userId: uid,
                        role: item,
                    }),
                );

                await transactionalEntityManager.save(UserRole, relations);
            }
        });
    }
}
