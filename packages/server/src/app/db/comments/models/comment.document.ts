import { Document } from 'mongoose';

import { Comment } from '@pulp-fiction/models/comments';

export interface CommentDocument extends Comment, Document {
    readonly _id: string;
}