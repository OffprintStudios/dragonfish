import { NotificationKind } from '@dragonfish/shared/models/notifications';
import { PublishStatus } from './publish-status';

// Base interface
export interface NotificationQueueItem {
    _id?: string;

    /**
     * The ID of the thing (Work, Document, Blog, etc) that triggered this notification.
     */
    sourceId: string;

    /**
     * (Optional) The user (if any) whose action triggered this notification.
     */
    creatorUserId?: string;
    kind: NotificationKind;
    publishStatus: PublishStatus;
    createdAt: Date;
    updatedAt: Date;
}
