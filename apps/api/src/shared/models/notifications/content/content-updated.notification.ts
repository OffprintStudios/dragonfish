import { Notification } from '../notification';

export interface ContentUpdatedNotification extends Notification {
    readonly contentId: string;
}
