import { PubStatus } from '../pub-status.enum';

export interface PubChange {
    readonly oldStatus: PubStatus;
    readonly newStatus: PubStatus;
}