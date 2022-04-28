import type { Profile } from '$lib/models/accounts';

export interface MessageThread {
    readonly _id: string;
    participants: Profile[];
    name: string;
    threadIcon: string;
    numMessages: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date;
}
