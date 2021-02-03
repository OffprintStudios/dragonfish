import { BlogNotificationInfo } from '@dragonfish/models/notifications/blog-notification-info.model';
import { NotificationQueueDocument } from '../notification-queue.schema';

export interface BlogNotificationQueueDocument extends NotificationQueueDocument, BlogNotificationInfo {
    readonly _id: string;
}