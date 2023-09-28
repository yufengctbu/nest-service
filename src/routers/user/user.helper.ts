// 创建redis数据存放email验证码的key值
export const userRegisterEmailPrefix = (email: string) => `EMAIL_${email}`;
