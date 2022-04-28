import { Pseudonym } from '$shared/models/accounts';

export interface Message {
    readonly _id: string;
    readonly threadId: string;
    readonly user: string | Pseudonym;
    message: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
