import { SectionNotificationInfo } from '@dragonfish/shared/models/notifications';
import { NotificationQueueDocument } from '../notification-queue.schema';

export interface SectionNotificationQueueDocument extends NotificationQueueDocument, SectionNotificationInfo {
    readonly _id: string;
}
