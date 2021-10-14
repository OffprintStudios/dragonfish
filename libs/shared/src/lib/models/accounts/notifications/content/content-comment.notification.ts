import { Notification } from '../notification';

export interface ContentCommentNotification extends Notification {
    readonly contentInfo: {
        readonly contentId: string;
        readonly contentTitle: string;
    };

    readonly commentInfo: {
        readonly page: number;
        readonly commentId: string;
    };

    readonly posterInfo: {
        readonly posterId: string;
        readonly posterName: string;
    };
}
