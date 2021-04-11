// This schema is temporary and only applicable to the Closed Alpha (aka, the Origins Arc)

import { Schema } from 'mongoose';

export const InviteCodesSchema = new Schema(
    {
        _id: { type: String, required: true },
        used: { type: Boolean, default: false },
        byWho: { type: String, ref: 'User' },
    },
    { collection: 'invite_codes' }
);
