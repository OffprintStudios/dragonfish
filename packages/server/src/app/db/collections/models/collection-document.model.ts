import { Document } from 'mongoose';

import { Collection } from '@pulp-fiction/models/collections';

export interface CollectionDocument extends Collection, Document {
    readonly _id: string;
}