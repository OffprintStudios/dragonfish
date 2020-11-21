import { SectionNotificationInfo } from '@pulp-fiction/models/notifications';
import { NotificationDocument } from '../notifications.schema';


export interface SectionNotificationDocument extends SectionNotificationInfo, NotificationDocument {
    readonly _id: string;    
}