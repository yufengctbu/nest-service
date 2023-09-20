/**
 * 获取当前的时间
 * @returns
 */
export const getCurrentTime = (): number => {
    return Math.round(Date.now() / 1000);
};
