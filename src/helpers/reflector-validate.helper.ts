import { reflector } from './reflector.helper';
import { HTTP_ORIGIN_RESPONSE } from '@app/constants/reflector.constant';

// 验证是否使用初始的api返回值
export const IsOriginResponse = (target: any): boolean => {
    return reflector.get<boolean>(HTTP_ORIGIN_RESPONSE, target) || false;
};
