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

export interface CreateWorkNotification extends CreateNotification, WorkNotificationInfo { }
export interface CreateSectionNotification extends CreateNotification, SectionNotificationInfo { }
export interface CreateBlogNotification extends CreateNotification, BlogNotificationInfo { }
export interface CreateCommentNotification extends CreateNotification, CommentNotificationInfo { }
export interface CreateNewsPostNotification extends CreateNotification, NewsPostNotificationInfo { }
export interface CreatePMThreadNotification extends CreateNotification, PMThreadNotificationInfo { }
export interface CreatePMReplyNotification extends CreateNotification, PMReplyNotificationInfo { }