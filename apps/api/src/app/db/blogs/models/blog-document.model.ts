import { Document } from 'mongoose';
import { Blog } from '@dragonfish/shared/models/blogs';

export interface BlogDocument extends Blog, Document {
    readonly _id: string;
}
