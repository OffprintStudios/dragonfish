import { WorkNotificationInfo } from '@dragonfish/models/notifications';
import { NotificationDocument } from '../notifications.schema';

export interface WorkNotificationDocument extends WorkNotificationInfo, NotificationDocument {
    readonly _id: string;    
}