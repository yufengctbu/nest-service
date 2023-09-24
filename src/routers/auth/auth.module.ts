import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET_SALT } from './auth.constant';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),

        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                return {
                    secret: JWT_SECRET_SALT,
                    signOptions: { expiresIn: configService.get('app.jwtExpiresIn') },
                };
            },
            inject: [ConfigService],
        }),
    ],

    providers: [AuthService, JwtStrategy],

    exports: [AuthService],
})
export class AuthModule {}
