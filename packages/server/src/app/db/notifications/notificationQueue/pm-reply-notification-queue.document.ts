import { PMReplyNotificationInfo } from '@pulp-fiction/models/notifications';
import { NotificationQueueDocument } from '../notification-queue.schema';

export interface PMReplyNotificationQueueDocument extends NotificationQueueDocument, PMReplyNotificationInfo {
    readonly _id: string;    
}