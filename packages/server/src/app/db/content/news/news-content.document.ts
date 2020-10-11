import { NewsContentModel } from '@pulp-fiction/models/content';
import { Document } from 'mongoose';

export interface NewsContentDocument extends NewsContentModel, Document {
    readonly _id: string;
}
