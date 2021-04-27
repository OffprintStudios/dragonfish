import { SectionNotificationInfo } from '@dragonfish/shared/models/notifications';
import { NotificationDocument } from '../notifications.schema';

export interface SectionNotificationDocument extends SectionNotificationInfo, NotificationDocument {
    readonly _id: string;
}
