import { BlogNotificationInfo } from '@dragonfish/models/notifications';
import { NotificationDocument } from '../notifications.schema';

export interface BlogNotificationDocument extends BlogNotificationInfo, NotificationDocument {
    readonly _id: string;
}
