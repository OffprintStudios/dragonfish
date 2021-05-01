import { PMReplyNotificationInfo } from '@dragonfish/shared/models/notifications';
import { NotificationDocument } from '../notifications.schema';

export interface PMReplyNotificationDocument extends PMReplyNotificationInfo, NotificationDocument {
    readonly _id?: string;
}
