import { CommentNotificationInfo } from '@pulp-fiction/models/notifications';
import { NotificationDocument } from '../notifications.schema';

export interface CommentNotificationDocument extends CommentNotificationInfo, NotificationDocument {
    readonly _id: string;    
}