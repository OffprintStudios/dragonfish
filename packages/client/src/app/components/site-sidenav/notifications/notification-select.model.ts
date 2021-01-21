import { NotificationBase } from '@pulp-fiction/models/notifications';

export interface NotificationSelect extends NotificationBase {
    selected: boolean;
}