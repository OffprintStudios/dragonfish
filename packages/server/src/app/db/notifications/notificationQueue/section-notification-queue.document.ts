import { SectionNotificationInfo } from '@pulp-fiction/models/notifications';
import { NotificationQueueDocument } from '../notification-queue.schema';

export interface SectionNotificationQueueDocument extends NotificationQueueDocument, SectionNotificationInfo {
    readonly _id: string;    
}