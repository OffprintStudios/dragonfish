import { WorkNotificationInfo } from '@dragonfish/models/notifications';
import { NotificationQueueDocument } from '../notification-queue.schema';

export interface WorkNotificationQueueDocument extends NotificationQueueDocument, WorkNotificationInfo {
    readonly _id: string;    
}