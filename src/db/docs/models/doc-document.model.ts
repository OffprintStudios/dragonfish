import { Document } from 'mongoose';

import { Doc } from 'shared/models/docs';

export interface DocDocument extends Doc, Document {
    readonly _id: string;
}

