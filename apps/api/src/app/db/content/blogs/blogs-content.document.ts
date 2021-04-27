import { BlogsContentModel } from '@dragonfish/shared/models/content';
import { Document } from 'mongoose';

export interface BlogsContentDocument extends BlogsContentModel, Document {
    readonly _id: string;
}
