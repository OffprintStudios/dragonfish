import { NotificationKind } from './notification-kind';

export interface NotificationSubscription {
    /**
     * The ID of the user subscribed to the notification source.
     */
    userId: string;

    /**
     * The ID of the thing that triggered the notification.
     */
    notificationSourceId: string;

    /**
     * The kind of thing that we are subscribing to notifications for.
     */
    notificationKind: NotificationKind;
}
