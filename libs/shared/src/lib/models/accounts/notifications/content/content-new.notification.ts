import { Notification } from '../notification';
import { ContentKind } from '../../../content';

export interface ContentNewNotification extends Notification {
    readonly contentInfo: {
        readonly contentId: string;
        readonly contentTitle: string;
        readonly contentKind: ContentKind;
    };

    readonly authorInfo: {
        readonly authorId: string;
        readonly authorName: string;
    };
}
