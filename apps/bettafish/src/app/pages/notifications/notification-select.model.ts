import { NotificationBase } from '@dragonfish/shared/models/notifications';

export interface NotificationSelectModel extends NotificationBase {
    selected: boolean;
}
