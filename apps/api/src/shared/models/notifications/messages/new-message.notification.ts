import { Notification } from '../notification';

export interface NewMessageNotification extends Notification {
    threadId: string;
    senderInfo: {
        screenName: string;
        avatar: string;
    };
}
