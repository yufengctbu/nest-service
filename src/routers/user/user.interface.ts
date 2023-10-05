// 登录后用返回给前端的token
export interface IUserLoginResponse {
    token: string;
}

// 缓存中用户的信息
export interface IUserLoginCache {
    id: number;

    username: string;

    email: string;

    roleIds: number[];

    token: string;
}
