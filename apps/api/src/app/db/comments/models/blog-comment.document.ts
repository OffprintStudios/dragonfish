import { Document } from 'mongoose';

import { BlogComment } from '@dragonfish/shared/models/comments';

export interface BlogCommentDocument extends BlogComment, Document {
    readonly _id: string;
}
