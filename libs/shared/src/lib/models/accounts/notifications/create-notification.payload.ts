import { PayloadInfo } from './payload-info';

export class CreateNotificationPayload<T extends PayloadInfo> {
    readonly id: string;
    readonly payload: T;
}
