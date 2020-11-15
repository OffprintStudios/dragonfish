import { BlogNotificationInfo } from './blog-notification-info.model';
import { NotificationKind } from './notification-kind';

export interface CreateNotification {
    /**
     * The ID of the thing (Work, Document, Blog, etc) that triggered this notification.
     */
    sourceId: string;
    kind: NotificationKind;
    title: string;    
}

export interface CreateBlogNotification extends CreateNotification, BlogNotificationInfo {

}