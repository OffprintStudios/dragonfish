import type { Content } from '$lib/models/content';
import type { Profile } from '$lib/models/accounts';

export interface QueueItem {
    readonly _id: string;
    readonly workToApprove: Content;
    claimedBy: Profile;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
