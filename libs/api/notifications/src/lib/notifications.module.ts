import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService, NotificationConsumer } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';

@Module({
    controllers: [],
    providers: [NotificationService, NotificationConsumer, Stores.NotificationStore],
    imports: [
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
        ]),
        BullModule.registerQueue({
            name: 'notifications',
        }),
    ],
    exports: [],
})
export class NotificationsModule {}
