import { NotificationKind } from '@dragonfish/models/notifications';
import { NotificationQueueDocumentKind } from './notificationQueue/notification-queue-document-kind';
import { NotificationDocumentKind } from './publishedNotifications/notification-document-kind';

// Contains a variety of helper functions to converted between document-specific
// discriminators and NotificationKind.
export namespace NotificationEnumConverters {
    // NotificationQueueDocument kind converters
    export function nqdkAsNotificationKind(nqdk: NotificationQueueDocumentKind): NotificationKind {
        switch (nqdk) {
            case NotificationQueueDocumentKind.NQDKBlogNotification: {
                return NotificationKind.BlogNotification;
            }
            case NotificationQueueDocumentKind.NQDKCommentNotification: {
                return NotificationKind.CommentNotification;
            }
            case NotificationQueueDocumentKind.NQDKNewsPostNotification: {
                return NotificationKind.NewsPostNotification;
            }
            case NotificationQueueDocumentKind.NQDKPMReplyNotification: {
                return NotificationKind.PMReplyNotification;
            }
            case NotificationQueueDocumentKind.NQDKPMThreadNotification: {
                return NotificationKind.PMThreadNotification;
            }
            case NotificationQueueDocumentKind.NQDKSectionNotification: {
                return NotificationKind.SectionNotification;
            }
            case NotificationQueueDocumentKind.NQDKWorkNotification: {
                return NotificationKind.WorkNotification;
            }
        }
    }

    export function notificationKindAsNQDK(notifKind: NotificationKind): NotificationQueueDocumentKind {
        switch (notifKind) {
            case NotificationKind.BlogNotification: {
                return NotificationQueueDocumentKind.NQDKBlogNotification;
            }
            case NotificationKind.CommentNotification: {
                return NotificationQueueDocumentKind.NQDKCommentNotification;
            }
            case NotificationKind.NewsPostNotification: {
                return NotificationQueueDocumentKind.NQDKNewsPostNotification;
            }
            case NotificationKind.PMReplyNotification: {
                return NotificationQueueDocumentKind.NQDKPMReplyNotification;
            }
            case NotificationKind.PMThreadNotification: {
                return NotificationQueueDocumentKind.NQDKPMThreadNotification;
            }
            case NotificationKind.SectionNotification: {
                return NotificationQueueDocumentKind.NQDKSectionNotification;
            }
            case NotificationKind.WorkNotification: {
                return NotificationQueueDocumentKind.NQDKWorkNotification;
            }
        }
    }

    // NotificationDocument converters
    export function ndkAsNotificationKind(ndk: NotificationDocumentKind): NotificationKind {
        switch (ndk) {
            case NotificationDocumentKind.NDKBlogNotification: {
                return NotificationKind.BlogNotification;
            }
            case NotificationDocumentKind.NDKCommentNotification: {
                return NotificationKind.CommentNotification;
            }
            case NotificationDocumentKind.NDKNewsPostNotification: {
                return NotificationKind.NewsPostNotification;
            }
            case NotificationDocumentKind.NDKPMReplyNotification: {
                return NotificationKind.PMReplyNotification;
            }
            case NotificationDocumentKind.NDKPMThreadNotification: {
                return NotificationKind.PMThreadNotification;
            }
            case NotificationDocumentKind.NDKSectionNotification: {
                return NotificationKind.SectionNotification;
            }
            case NotificationDocumentKind.NDKWorkNotification: {
                return NotificationKind.WorkNotification;
            }
        }
    }

    export function notificationKindAsNDK(notifKind: NotificationKind): NotificationDocumentKind {
        switch (notifKind) {
            case NotificationKind.BlogNotification: {
                return NotificationDocumentKind.NDKBlogNotification;
            }
            case NotificationKind.CommentNotification: {
                return NotificationDocumentKind.NDKCommentNotification;
            }
            case NotificationKind.NewsPostNotification: {
                return NotificationDocumentKind.NDKNewsPostNotification;
            }
            case NotificationKind.PMReplyNotification: {
                return NotificationDocumentKind.NDKPMReplyNotification;
            }
            case NotificationKind.PMThreadNotification: {
                return NotificationDocumentKind.NDKPMThreadNotification;
            }
            case NotificationKind.SectionNotification: {
                return NotificationDocumentKind.NDKSectionNotification;
            }
            case NotificationKind.WorkNotification: {
                return NotificationDocumentKind.NDKWorkNotification;
            }
        }
    }
}
