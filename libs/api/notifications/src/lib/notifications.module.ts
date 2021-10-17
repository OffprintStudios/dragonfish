import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService, NotificationConsumer } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';
import { ContentModule } from '@dragonfish/api/database/content';

@Module({
    controllers: [],
    providers: [
        NotificationService,
        NotificationConsumer,
        Stores.NotificationStore,
        Stores.ContentCommentStore,
        Stores.SubscriptionsStore,
    ],
    imports: [
        ContentModule,
        MongooseModule.forFeatureAsync([
            {
                name: 'Notification',
                useFactory: Schemas.setupNotificationsCollection,
                discriminators: [
                    { name: 'ContentCommentNotification', schema: Schemas.ContentCommentSchema },
                    { name: 'ContentNewNotification', schema: Schemas.ContentNewSchema },
                    { name: 'ContentUpdatedNotification', schema: Schemas.ContentUpdatedSchema },
                ],
            },
            {
                name: 'Subscription',
                useFactory: Schemas.setupSubscriptionsCollection,
            },
        ]),
        BullModule.registerQueue({
            name: 'notifications',
        }),
    ],
    exports: [],
})
export class NotificationsModule {}
