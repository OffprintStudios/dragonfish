import { SectionNotificationInfo } from '@dragonfish/models/notifications';
import { NotificationDocument } from '../notifications.schema';


export interface SectionNotificationDocument extends SectionNotificationInfo, NotificationDocument {
    readonly _id: string;    
}