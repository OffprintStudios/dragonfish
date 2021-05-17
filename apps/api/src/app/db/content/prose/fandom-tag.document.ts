import { FandomTag } from '@dragonfish/shared/models/content';
import { Document } from 'mongoose';

export interface FandomTagDocument extends FandomTag, Document {
    readonly _id: string;
}
