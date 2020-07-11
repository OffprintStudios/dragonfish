import { Document } from 'mongoose';

export interface InviteCodes extends Document {
    readonly _id: string;
    readonly used: boolean;
    readonly byWho: string;
}
