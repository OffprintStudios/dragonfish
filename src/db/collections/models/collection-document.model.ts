import { Document } from 'mongoose';

import { Collection } from 'shared/models/collections';

export interface CollectionDocument extends Collection, Document {
    readonly _id: string;
}