import { PoetryContent } from '@pulp-fiction/models/content';
import { Document } from 'mongoose';

export interface PoetryContentDocument extends PoetryContent, Document {
    readonly _id: string;
}