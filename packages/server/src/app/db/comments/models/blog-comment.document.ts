import { Document } from 'mongoose';

import { BlogComment } from '@dragonfish/models/comments';

export interface BlogCommentDocument extends BlogComment, Document {
    readonly _id: string;
}