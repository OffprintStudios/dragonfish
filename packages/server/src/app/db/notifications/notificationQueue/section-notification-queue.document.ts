import { SectionNotificationInfo } from '@dragonfish/models/notifications';
import { NotificationQueueDocument } from '../notification-queue.schema';

export interface SectionNotificationQueueDocument extends NotificationQueueDocument, SectionNotificationInfo {
    readonly _id: string;    
}