import { Notification } from '../notification';

export interface ContentUpdatedNotification extends Notification {
    readonly contentInfo: {
        readonly contentId: string;
        readonly contentTitle: string;
    };

    readonly sectionInfo: {
        readonly sectionTitle: string;
    };
}
