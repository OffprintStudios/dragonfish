import { Document } from 'mongoose';
import { Blog } from '@pulp-fiction/models/blogs';

export interface BlogDocument extends Blog, Document {
    readonly _id: string;   
}