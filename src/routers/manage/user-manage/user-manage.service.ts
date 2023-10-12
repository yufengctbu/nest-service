import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In, EntityManager } from 'typeorm';

import { User, Role, UserRole } from '@app/entities';
import { ERROR_CODE } from '@app/constants/error-code.constant';
import { FailException } from '@app/exceptions/fail.exception';
import { userLoginCachePrefix } from '@app/routers/user/user.helper';
import { RedisService } from '@app/shared/redis';
import { IUserLoginCache } from '@app/routers/user/user.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserManageService {
    public constructor(
        private readonly dataSource: DataSource,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    /**
     * 给用户分配角色
     * @param uid
     * @param roles
     */
    public async distributeUserRoles(uid: number, roles: string = ''): Promise<void> {
        const targetUser = await this.userRepository.findOne({
            select: ['id', 'email'],
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

        const userStoreHandle = userLoginCachePrefix(targetUser.id, targetUser.email);
        const userInfo = await this.redisService.get<IUserLoginCache>(userStoreHandle);
        // 如果不配置，那么则不设置过期时间
        const expireTime = this.configService.get<number>('app.loginExpiresIn');

        if (userInfo) {
            userInfo.roleIds = roleList.map((item) => item.id);
            await this.redisService.set(userStoreHandle, userInfo, expireTime);
        }
    }
}
