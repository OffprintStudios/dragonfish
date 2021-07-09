import { NotificationKind } from './notification-kind';

// Base interface
export interface NotificationBase {
    _id?: string;

    /**
     * The ID of the user this notification was sent to.
     */
    destinationUserId: string;

    /**
     * The ID of the thing (Work, Document, Blog, etc) that triggered this notification.
     */
    sourceId: string;

    /**
     * (Optional) The user (if any) whose action triggered this notification.
     */
    creatorUserId?: string;
    kind: NotificationKind;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}
