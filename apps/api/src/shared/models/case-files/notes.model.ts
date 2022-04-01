import { Pseudonym } from '$shared/models/accounts';

export interface Note {
    readonly _id: string;
    readonly user: string | Pseudonym;
    body: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
