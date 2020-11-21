import { PMThreadNotificationInfo } from '@pulp-fiction/models/notifications';
import { NotificationDocument } from '../notifications.schema';

export interface PMThreadNotificationDocument extends PMThreadNotificationInfo, NotificationDocument {
    readonly _id: string;    
}