import { Document } from 'mongoose';

import { BlogComment } from '@pulp-fiction/models/comments';

export interface BlogCommentDocument extends BlogComment, Document {
    readonly _id: string;
}