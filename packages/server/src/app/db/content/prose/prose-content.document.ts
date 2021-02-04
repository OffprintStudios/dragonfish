import { ProseContent } from '@dragonfish/models/content';
import { Document } from 'mongoose';

export interface ProseContentDocument extends ProseContent, Document {
    readonly _id: string;
}
