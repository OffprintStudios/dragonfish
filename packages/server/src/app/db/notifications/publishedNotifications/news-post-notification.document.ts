import { NewsPostNotificationInfo } from '@pulp-fiction/models/notifications';
import { NotificationDocument } from '../notifications.schema';

export interface NewsPostNotificationDocument extends NewsPostNotificationInfo, NotificationDocument {
    readonly _id: string;    
}