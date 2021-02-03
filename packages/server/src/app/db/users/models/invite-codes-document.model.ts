import { Document } from 'mongoose';

import { InviteCodes } from '@dragonfish/models/users';

export interface InviteCodesDocument extends InviteCodes, Document {
    readonly _id: string;
}
