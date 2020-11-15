import { PMReplyNotificationInfo } from '@pulp-fiction/models/notifications';
import { NotificationDocument } from '../notifications.schema';

export interface PMReplyNotificationDocument extends PMReplyNotificationInfo, NotificationDocument {
    readonly _id: string;    
}