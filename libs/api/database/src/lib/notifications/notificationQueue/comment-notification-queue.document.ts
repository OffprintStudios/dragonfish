import { CommentNotificationInfo } from '@dragonfish/shared/models/notifications';
import { NotificationQueueDocument } from '../notification-queue.schema';

export interface CommentNotificationQueueDocument extends NotificationQueueDocument, CommentNotificationInfo {
    readonly _id: string;
}
