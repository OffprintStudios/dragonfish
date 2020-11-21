import { BlogNotificationInfo } from '@pulp-fiction/models/notifications';
import { NotificationDocument } from '../notifications.schema';

export interface BlogNotificationDocument extends BlogNotificationInfo, NotificationDocument {
    readonly _id: string;    
}