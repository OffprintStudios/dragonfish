import { NewsContentModel } from '@dragonfish/shared/models/content';
import { Document } from 'mongoose';

export interface NewsContentDocument extends NewsContentModel, Document {
    readonly _id: string;
}
