import type { Profile } from '$lib/models/accounts';

export interface FollowingUser {
    readonly _id: string;
    readonly subscriberId: string | Profile;
    readonly itemId: string | Profile;
    readonly kind: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
