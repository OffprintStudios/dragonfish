import { NotificationKind } from './notification-kind.enum';

export interface NotificationQueueModel {
    readonly sourceId: string;
    readonly creatorId?: string;
    readonly kind: NotificationKind;
}
