import { ContentKind } from '../content';
import { BlogNotificationInfo } from './blog-notification-info.model';
import { CommentNotificationInfo } from './comment-notification-info.model';
import { NewsPostNotificationInfo } from './news-post-notification-info.model';
import { NotificationKind } from './notification-kind';
import { PMReplyNotificationInfo } from './pm-reply-notification-info.model';
import { PMThreadNotificationInfo } from './pm-thread-notification-info.model';
import { SectionNotificationInfo } from './section-notification-info.model';
import { WorkNotificationInfo } from './work-notification-info.model';

export interface CreateNotification {
    /**
     * The ID of the thing (Work, Document, Blog, etc) that triggered this notification.
     */
    sourceId: string;
    kind: NotificationKind;
}

export interface CreateWorkNotification extends CreateNotification {}

export interface CreateSectionNotification extends CreateNotification {}

export interface CreateBlogNotification extends CreateNotification {
    authorId: string;
    authorName: string;
}

export interface CreateCommentNotification extends CreateNotification {
    commentId: string;
    commenterName: string;
    commenterId: string;
    parentKind: ContentKind;
    parentTitle: string;
}

export interface CreateNewsPostNotification extends CreateNotification {}

export interface CreatePMThreadNotification extends CreateNotification {}

export interface CreatePMReplyNotification extends CreateNotification {}
