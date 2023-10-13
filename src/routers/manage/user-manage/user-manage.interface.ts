import { IPagination } from '@app/interfaces/pagination.interface';
import { IUserInfo } from '@app/routers/user/user.interface';

// 查询用户列表
export interface IUserListResponse extends IPagination {
    users: IUserInfo[];
}
