import { Document } from 'mongoose';

import { Comment } from 'shared/models/comments';

export interface CommentDocument extends Comment, Document {
    readonly _id: string;
}