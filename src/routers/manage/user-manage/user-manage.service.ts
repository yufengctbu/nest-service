import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In, EntityManager } from 'typeorm';

import { UserListDto } from './user-manage.dto';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@app/shared/redis';
import { User, Role, UserRole } from '@app/entities';
import { USER_REMOVE_MODE } from './user-manage.constant';
import { IUserListResponse } from './user-manage.interface';
import { FailException } from '@app/exceptions/fail.exception';
import { ERROR_CODE } from '@app/constants/error-code.constant';
import { IUserLoginCache } from '@app/routers/user/user.interface';
import { userLoginCachePrefix } from '@app/routers/user/user.helper';
import { USER_STATUS } from '@app/routers/user/user.constant';

@Injectable()
export class UserManageService {
    public constructor(
        private readonly dataSource: DataSource,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    /**
     * 查询用户列表
     * @param userListParam
     */
    public async queryUserList(userListParam: UserListDto): Promise<IUserListResponse> {
        const { page, pageSize, q } = userListParam;

        let handle = this.userRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.username', 'user.email', 'user.avatar', 'user.status']);

        if (page && pageSize) handle = handle.skip((page - 1) * pageSize).take(pageSize);

        if (q) handle = handle.where('user.username LIKE :query', { query: `%${q}%` });

        const [users, count] = await handle.getManyAndCount();

        return {
            count,
            users,
            pagination: {
                page: page ?? 1,
                pageSize: pageSize ?? count,
            },
        };
    }

    /**
     * 给用户分配角色
     * @param currentUser
     * @param uid
     * @param roles
     */
    public async distributeUserRoles(currentUser: number, uid: number, roles: string = ''): Promise<void> {
        // 排除自己给自己授角的情况
        if (currentUser === uid) throw new FailException(ERROR_CODE.COMMON.RESTRICTED_PERMISSIONS);
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

    /**
     * 删除用户
     * @param currentUser
     * @param userIds
     * @param rigid
     */
    public async removeUsers(currentUser: number, userIds: string, rigid: USER_REMOVE_MODE): Promise<void> {
        const idList = userIds.split(',').map((item) => Number(item));

        const userList = await this.userRepository.find({ where: { id: In(idList) } });

        if (userList.length < 1) throw new FailException(ERROR_CODE.USER.USER_NOT_EXISTS);

        // 用户不能自己删除自己
        if (userList.find((item) => item.id === currentUser)) throw new FailException(ERROR_CODE.COMMON.RESTRICTED_PERMISSIONS);

        if (rigid === USER_REMOVE_MODE.FORBID) {
            userList.map((item) => {
                item.status = USER_STATUS.FORBID;
                return item;
            });

            await this.userRepository.save(userList);

            const handleList = userList.map((item) => userLoginCachePrefix(item.id, item.email));
            // 已登录的用户需要退出
            await this.redisService.delete(handleList);
        } else {
            console.log('remove user');
        }

        console.log(userList);
    }
}
