import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { IPayLoad } from './auth.interface';
import { JWT_SECRET_SALT } from './auth.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    public constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET_SALT,
        });
    }

    async validate(payload: IPayLoad) {
        try {
            const { id, username, email } = payload;

            return { id, username, email };
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}
