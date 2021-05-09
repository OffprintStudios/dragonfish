import { ContentKind } from '../content';
import { NotificationKind } from './notification-kind';

export interface CreateNotification {
    /**
     * The ID of the thing (Work, Document, Blog, etc) that triggered this notification.
     */
    sourceId: string;

    /**
     * (Optional) The user (if any) whose action triggered this notification.
     */
    creatorUserId?: string;
    kind: NotificationKind;
}

export interface CreateWorkNotification extends CreateNotification { }

export interface CreateSectionNotification extends CreateNotification { }

export interface CreateBlogNotification extends CreateNotification {
    authorId: string;
    authorName: string;
}

export interface CreateCommentNotification extends CreateNotification {
    commentId: string;
    commenterName: string;
    parentKind: ContentKind;
    parentTitle: string;
}

export interface CreateNewsPostNotification extends CreateNotification { }

export interface CreatePMThreadNotification extends CreateNotification { }

export interface CreatePMReplyNotification extends CreateNotification { }
