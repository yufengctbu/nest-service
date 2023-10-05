// 创建redis数据存放email验证码的key值
export const userRegisterEmailPrefix = (email: string) => `EMAIL_${email}`;

// 创建redis数据存放用户信息的key值
export const userLoginCachePrefix = (id: number, email: string) => `USER_${id}_${email}`;
