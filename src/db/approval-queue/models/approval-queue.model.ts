import { Document } from 'mongoose';

import { User } from 'src/db/users/models';
import { Work } from 'src/db/works/models';

export interface ApprovalQueue extends Document {
    readonly _id: string;
    readonly workToApprove: string | Work;
    readonly claimedBy: string | UserInfo;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

interface UserInfo {
    readonly _id: string;
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
    };
}