import { Document } from 'mongoose';

import { User } from 'shared/models/users';

export interface UserDocument extends User, Document {
    readonly _id: string;   
}