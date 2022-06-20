import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule } from '$modules/content';
import { AccountsModule } from '$modules/accounts';
import { getJwtSecretKey, JWT_EXPIRATION } from '$shared/util';
import { NotificationKind, SubscriptionKind } from '$shared/models/notifications';
import * as Schemas from './db/schemas';
import * as Stores from './db/stores';
import * as Services from './services';
import * as Controllers from './controllers';

@Module({
    imports: [
        AccountsModule,
        ContentModule,
        MongooseModule.forFeatureAsync([
            {
                name: 'Notification',
                useFactory: Schemas.setupNotificationsCollection,
                discriminators: [
                    { name: NotificationKind.ContentComment, schema: Schemas.ContentCommentSchema },
                    { name: NotificationKind.CommentReply, schema: Schemas.CommentReplySchema },
                    { name: NotificationKind.ContentNew, schema: Schemas.ContentNewSchema },
                    { name: NotificationKind.ContentUpdate, schema: Schemas.ContentUpdatedSchema },
                    { name: NotificationKind.AddedToLibrary, schema: Schemas.AddedToLibrarySchema },
                    { name: NotificationKind.MessageReceived, schema: Schemas.NewMessageSchema },
                ],
            },
            {
                name: 'Subscription',
                useFactory: Schemas.setupSubscriptionsCollection,
                discriminators: [
                    { name: SubscriptionKind.FollowingUser, schema: Schemas.FollowersSchema },
                ],
            },
        ]),
        BullModule.registerQueue({
            name: 'notifications',
            limiter: {
                max: 1000,
                duration: 1000 * 30,
            },
            defaultJobOptions: {
                removeOnComplete: true,
                removeOnFail: true,
                attempts: 3,
                delay: 0,
            },
        }),
        BullModule.registerQueue({
            name: 'push-notifications',
            limiter: {
                max: 1000,
                duration: 1000 * 30,
            },
        }),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: getJwtSecretKey(),
                signOptions: { expiresIn: JWT_EXPIRATION },
            }),
        }),
    ],
    controllers: [Controllers.NotificationsController, Controllers.FollowersController],
    providers: [
        Stores.NotificationStore,
        Stores.SubscriptionsStore,
        Stores.ContentCommentStore,
        Stores.CommentReplyStore,
        Stores.AddedToLibraryStore,
        Stores.ContentUpdatedStore,
        Stores.MessageReceivedStore,
        Services.FollowersService,
        Services.NotificationService,
        Services.NotificationConsumer,
        Services.PushNotificationsConsumer,
        Services.SubscriptionsService,
        Controllers.NotificationsGateway,
    ],
})
export class NotificationsModule {}
