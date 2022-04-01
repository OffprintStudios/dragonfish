import type { NotificationKind } from './notification-kind';

export interface Notification {
    // Document ID
    readonly _id: string;

    // Who this notification goes to
    readonly recipientId: string;

    // Is this notification read
    markedAsRead: boolean;

    // What kind of notification this is
    readonly kind: NotificationKind;

    // When was it made
    readonly createdAt: Date;

    // When was it updated
    readonly updatedAt: Date;
}
