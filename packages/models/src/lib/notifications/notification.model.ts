import { NotificationKind } from './notification-kind';

export interface Notification {
    _id: string;
    userId: string;
    kind: NotificationKind;
    title: string;
    body?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
}