import { Document, Model } from 'mongoose';
import { Module, Provider } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';

import { NotificationSchema, NotificationSubSchemaProviders } from './notifications.schema';
import { NotificationQueueSchema, NotificationQueueSubSchemaProviders } from './notification-queue.schema';
import { NotificationsService } from './notifications.service';
import { NotificationSubscriptionSchema } from './notification-subscriptions.schema';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'Notification',
                useFactory: () => {
                    const schema = NotificationSchema;
                    return schema;
                },
            },
            {
                name: 'NotificationQueue',
                useFactory: () => {
                    const schema = NotificationQueueSchema;
                    return schema;
                },
            },
            {
                name: 'NotificationSubscription',
                useFactory: () => {
                    const schema = NotificationSubscriptionSchema;
                    return schema;
                },
            },
        ]),
    ],
    providers: [NotificationsService, ...NotificationQueueSubSchemaProviders, ...NotificationSubSchemaProviders],
    exports: [NotificationsService],
})
export class NotificationsModule {}

/**
 * Function that return a NestJS Provider that provides a Notifications model with additional
 * fields for a given discriminator.
 * @param token The NestJS provider token of the new schema being defined.
 * @param parentToken The NestJS provider token of the parent schema being inherited from.
 * @param subSchemaFunction The function responsible for returning a Mongoose schema as defined by
 * a Model<T> object. Should usually call the `.discriminator()` function on the passed-in model.
 */
export function getSubSchemaProvider<T extends Document>(
    token: string,
    parentToken: string,
    subSchemaFunction: (notificationModel: Model<T>) => Model<T>,
): Provider {
    return {
        provide: getModelToken(token),
        useFactory: (model) => subSchemaFunction(model),
        inject: [getModelToken(parentToken)],
    };
}
