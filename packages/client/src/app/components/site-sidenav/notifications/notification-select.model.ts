import { NotificationBase } from '@dragonfish/models/notifications';

export interface NotificationSelect extends NotificationBase {
    selected: boolean;
}