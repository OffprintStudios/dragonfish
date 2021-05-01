import { ProseContent } from '@dragonfish/shared/models/content';
import { Document } from 'mongoose';

export interface ProseContentDocument extends ProseContent, Document {
    readonly _id: string;
}
