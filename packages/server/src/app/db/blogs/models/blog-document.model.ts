import { Document } from 'mongoose';
import { Blog } from '@dragonfish/models/blogs';

export interface BlogDocument extends Blog, Document {
    readonly _id: string;   
}