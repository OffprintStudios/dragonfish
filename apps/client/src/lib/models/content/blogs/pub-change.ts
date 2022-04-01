import type { PubStatus } from '../pub-status';

export interface PubChange {
    readonly oldStatus: PubStatus;
    readonly newStatus: PubStatus;
}
