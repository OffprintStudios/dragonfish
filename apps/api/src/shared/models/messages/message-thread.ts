import { Pseudonym } from '$shared/models/accounts';

export interface MessageThread {
    readonly _id: string;
    participants: string[] | Pseudonym[];
    name: string;
    threadIcon: string;
    numMessages: number;
    lastMessageOn: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date;
}
