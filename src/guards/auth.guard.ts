import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { formatAuthorization } from '@app/helpers/utils.helper';
import { IsPublicInterface } from '@app/helpers/reflector-validate.helper';

export class JwtAuthGuard extends AuthGuard('jwt') {
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        // 如果是非验证的接口，则直接访问
        if (IsPublicInterface(context.getHandler())) return true;

        // 如果jwt的token验证失败，则直接抛错, canActivate调用的是jwt.strategy.ts中的validate方法
        if (!(await super.canActivate(context))) throw new UnauthorizedException();

        const request: Request = context.switchToHttp().getRequest();
        const auth = formatAuthorization(request.get('Authorization'));

        console.log(auth);

        return false;
    }
}
