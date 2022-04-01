import { Notification } from '../notification';

export interface CommentReplyNotification extends Notification {
    readonly threadInfo: {
        readonly threadId: string;
        readonly threadTitle: string;
    };

    readonly commentInfo: {
        readonly commentId: string;
        readonly posterName: string;
        readonly posterId: string;
        readonly posterTag: string;
    };
}
