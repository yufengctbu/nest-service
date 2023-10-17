/**
 * 获取当前的时间
 * @returns
 */
export const getCurrentTime = (): number => {
    return Math.round(Date.now() / 1000);
};

/**
 * 把前端传到服务端的token进行格式化
 * @param token
 * @returns
 */
export const formatAuthorization = (token: string | undefined): string | null => {
    return token ? token.replace(/Bearer\s*/, '') : null;
};

/**
 * 生成指定位数的验证码
 * @param len
 * @returns
 */
export const generateCode = (len: number = 6): string => {
    if (isNaN(len)) len = 6;

    let code = '';
    for (let i = 0; i < len; i++) {
        code += Math.floor(Math.random() * 10);
    }

    return code;
};

/**
 * 路由匹配方法
 * '/foo/bar' matches '/foo/*', '/resource1' matches '/:resource'
 * @param key1
 * @param key2
 * @returns
 */
export const routerMatch = (key1: string, key2: string): boolean => {
    key2 = key2.replace(/\/\*/g, '/.*');

    const regexp = new RegExp(/(.*):[^/]+(.*)/g);

    for (;;) {
        if (!key2.includes('/:')) break;

        key2 = key2.replace(regexp, '$1[^/]+$2');
    }

    if (key2 === '*') key2 = '(.*)';

    return new RegExp(`^${key2}$`).test(key1);
};
