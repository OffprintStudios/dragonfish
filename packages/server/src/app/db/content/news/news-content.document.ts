import { NewsContentModel } from '@dragonfish/models/content';
import { Document } from 'mongoose';

export interface NewsContentDocument extends NewsContentModel, Document {
    readonly _id: string;
}
