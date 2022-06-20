import { NotificationSchema } from './notification.schema';
import { SubscriptionSchema } from './subscription.schema';
import paginate from 'mongoose-paginate-v2';

//#region ---EXPORTS---

export { NotificationDocument, NotificationSchema } from './notification.schema';
export { SubscriptionDocument, SubscriptionSchema } from './subscription.schema';
export * from './content';
export * from './comments';
export * from './subscriptions';
export * from './messages';

//#endregion

//#region ---SCHEMA FACTORIES---

/**
 * Sets up the notifications collection.
 */
export async function setupNotificationsCollection() {
    const schema = NotificationSchema;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    schema.plugin(require('mongoose-autopopulate'));
    schema.plugin(paginate);

    return schema;
}

/**
 * Sets up the subscriptions collection.
 */
export async function setupSubscriptionsCollection() {
    return SubscriptionSchema;
}

//#endregion
