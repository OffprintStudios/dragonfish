import { Document } from 'mongoose';

import { Doc } from '@pulp-fiction/models/docs';

export interface DocDocument extends Doc, Document {
    readonly _id: string;
}

