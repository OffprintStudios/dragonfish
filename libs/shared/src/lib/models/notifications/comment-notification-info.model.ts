import { ContentKind } from '../content';
import { NotificationBase } from './notification-base.model';

export interface CommentNotificationInfo extends NotificationBase {
    commentId: string;
    commenterName: string;
    commenterId: string;
    parentKind: ContentKind;
    parentTitle: string;
}
