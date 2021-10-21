import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService, NotificationConsumer, PushNotificationsConsumer, SubscriptionsService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';
import { ContentModule } from '@dragonfish/api/database/content';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';
import { NotificationsController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { getJwtSecretKey, JWT_EXPIRATION } from '@dragonfish/api/utilities/secrets';
import { AccountsModule } from '@dragonfish/api/database/accounts';

@Module({
    controllers: [NotificationsController],
    providers: [
        NotificationService,
        NotificationConsumer,
        PushNotificationsConsumer,
        SubscriptionsService,
        Stores.NotificationStore,
        Stores.ContentCommentStore,
        Stores.SubscriptionsStore,
    ],
    imports: [
        ContentModule,
        AccountsModule,
        MongooseModule.forFeatureAsync([
            {
                name: 'Notification',
                useFactory: Schemas.setupNotificationsCollection,
                discriminators: [
                    { name: NotificationKind.ContentComment, schema: Schemas.ContentCommentSchema },
                    { name: NotificationKind.ContentNew, schema: Schemas.ContentNewSchema },
                    { name: NotificationKind.ContentUpdate, schema: Schemas.ContentUpdatedSchema },
                ],
            },
            {
                name: 'Subscription',
                useFactory: Schemas.setupSubscriptionsCollection,
            },
        ]),
        BullModule.registerQueue({
            name: 'notifications',
            limiter: {
                max: 1000,
                duration: 5000,
            },
        }),
        BullModule.registerQueue({
            name: 'push-notifications',
            limiter: {
                max: 1000,
                duration: 5000,
            },
        }),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    exports: [],
})
export class NotificationsModule {}
