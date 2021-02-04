import { PMReplyNotificationInfo } from '@dragonfish/models/notifications';
import { NotificationQueueDocument } from '../notification-queue.schema';

export interface PMReplyNotificationQueueDocument extends NotificationQueueDocument, PMReplyNotificationInfo {
    readonly _id: string;    
}