import { Document } from 'mongoose';

import { Comment } from '@dragonfish/shared/models/comments';

export interface CommentDocument extends Comment, Document {
    readonly _id: string;
}
