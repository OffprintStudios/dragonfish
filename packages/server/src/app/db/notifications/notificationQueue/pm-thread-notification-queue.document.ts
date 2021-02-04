import { PMThreadNotificationInfo } from '@dragonfish/models/notifications';
import { NotificationQueueDocument } from '../notification-queue.schema';

export interface PMThreadNotificationQueueDocument extends NotificationQueueDocument, PMThreadNotificationInfo {
    readonly _id: string;
}
