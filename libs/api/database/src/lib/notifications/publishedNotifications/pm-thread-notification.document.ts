import { PMThreadNotificationInfo } from '@dragonfish/shared/models/notifications';
import { NotificationDocument } from '../notifications.schema';

export interface PMThreadNotificationDocument extends PMThreadNotificationInfo, NotificationDocument {
    readonly _id: string;
}
