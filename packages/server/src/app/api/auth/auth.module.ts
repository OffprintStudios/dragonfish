import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../../db/users/users.module';
import { ImagesModule } from '../images/images.module';
import { getJwtSecretKey, JWT_EXPIRATION } from '../../util';

@Module({
    imports: [
        UsersModule,
        ImagesModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
