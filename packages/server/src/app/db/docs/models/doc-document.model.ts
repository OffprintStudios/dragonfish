import { Document } from 'mongoose';

import { Doc } from '@dragonfish/models/docs';

export interface DocDocument extends Doc, Document {
    readonly _id: string;
}

