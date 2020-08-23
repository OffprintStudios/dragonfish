import { Document } from 'mongoose';

import { InviteCodes } from '@pulp-fiction/models/users';

export interface InviteCodesDocument extends InviteCodes, Document {
    readonly _id: string;
}
