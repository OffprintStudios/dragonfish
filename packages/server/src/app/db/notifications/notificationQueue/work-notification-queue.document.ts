import { WorkNotificationInfo } from '@pulp-fiction/models/notifications';
import { NotificationQueueDocument } from '../notification-queue.schema';

export interface WorkNotificationQueueDocument extends NotificationQueueDocument, WorkNotificationInfo {
    readonly _id: string;    
}