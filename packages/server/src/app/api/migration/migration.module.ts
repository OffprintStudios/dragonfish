import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../../db/users/users.module';
import { getJwtSecretKey, JWT_EXPIRATION } from '../../util';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: {expiresIn: JWT_EXPIRATION},
            }),
        }),
    ],
    providers: [],
    controllers: []
})
export class MigrationModule {}