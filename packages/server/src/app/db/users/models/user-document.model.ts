import { Document } from 'mongoose';

import { User } from '@pulp-fiction/models/users';

export interface UserDocument extends User, Document {
    readonly _id: string;   
}