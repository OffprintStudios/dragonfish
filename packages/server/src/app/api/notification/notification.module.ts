import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { NotificationController } from './notification.controller';
import { UsersModule } from '../../db/users/users.module';
import { getJwtSecretKey, JWT_EXPIRATION } from '../../util';
import { NotificationsModule } from '../../db/notifications/notifications.module';

@Module({
    imports: [
        NotificationsModule,
        UsersModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    controllers: [NotificationController],
})
export class NotificationModule {}
