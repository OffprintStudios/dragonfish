import type { Notification } from '../notification';
import type { ContentKind } from '../../content';

export interface AddedToLibraryNotification extends Notification {
    readonly contentInfo: {
        readonly contentId: string;
        readonly contentTitle: string;
        readonly contentKind: ContentKind;
    };

    readonly addedByInfo: {
        readonly userId: string;
        readonly userTag: string;
        readonly userName: string;
    };
}
