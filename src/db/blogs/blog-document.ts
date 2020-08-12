import { Document } from 'mongoose';
import { Blog, UserInfo } from 'shared/models/blogs';

export interface BlogDocument extends Blog, Document {
    readonly _id: string;   
}