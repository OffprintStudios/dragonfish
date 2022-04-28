import type { Profile } from '$lib/models/accounts';

export interface Message {
    readonly _id: string;
    readonly threadId: string;
    readonly user: Profile;
    message: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
