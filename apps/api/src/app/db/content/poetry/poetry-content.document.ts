import { PoetryContent } from '@dragonfish/shared/models/content';
import { Document } from 'mongoose';

export interface PoetryContentDocument extends PoetryContent, Document {
    readonly _id: string;
}
