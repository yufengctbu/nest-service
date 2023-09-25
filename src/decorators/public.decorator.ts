import { SetMetadata } from '@nestjs/common';

import { PUBLIC_ACCESS_INTERFACE } from '@app/constants/reflector.constant';

/**
 * 免验证登录标识
 * @returns
 */
export const UsePublicInterface = (): MethodDecorator => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        SetMetadata(PUBLIC_ACCESS_INTERFACE, true)(descriptor.value);
    };
};
