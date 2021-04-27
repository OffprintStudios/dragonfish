import { Document } from 'mongoose';

import { InviteCodes } from '@dragonfish/shared/models/users';

export interface InviteCodesDocument extends InviteCodes, Document {
    readonly _id: string;
}
