import { NotificationBase } from './notification-base.model';

export interface BlogNotificationInfo extends NotificationBase {
    authorId: string;
    authorName: string;
}
