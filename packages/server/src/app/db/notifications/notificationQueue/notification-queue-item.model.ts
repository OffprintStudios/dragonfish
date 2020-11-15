import { NotificationKind } from '@pulp-fiction/models/notifications';
import { PublishStatus } from './publish-status';

// Base interface
export interface NotificationQueueItem {
    _id: string;

    /**
     * The ID of the thing (Work, Document, Blog, etc) that triggered this notification.
     */
    sourceId: string;
    kind: NotificationKind;    
    publishStatus: PublishStatus;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}