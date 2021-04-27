import { Document } from 'mongoose';

import { User } from '@dragonfish/shared/models/users';

export interface UserDocument extends User, Document {
    readonly _id: string;
}
