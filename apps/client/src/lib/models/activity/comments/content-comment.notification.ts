import type { Notification } from '../notification';
import type { ContentKind } from '../../content';

export interface ContentCommentNotification extends Notification {
    readonly contentInfo: {
        readonly contentId: string;
        readonly contentTitle: string;
        readonly contentKind: ContentKind;
    };

    readonly commentInfo: {
        readonly commentId: string;
        readonly posterName: string;
        readonly posterId: string;
        readonly posterTag: string;
    };
}
