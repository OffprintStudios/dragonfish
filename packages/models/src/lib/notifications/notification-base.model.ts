import { NotificationKind } from './notification-kind';

// Base interface
export interface NotificationBase {
    _id: string;

    /**
     * The ID of the user this notification was sent to.
     */
    destinationUserId: string;

    /**
     * The ID of the thing (Work, Document, Blog, etc) that triggered this notification.
     */
    sourceId: string;
    kind: NotificationKind;        
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}
