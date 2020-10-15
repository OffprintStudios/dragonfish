import { Document } from 'mongoose';

import { ContentComment } from '@pulp-fiction/models/comments';

export interface ContentCommentDocument extends ContentComment, Document {
    readonly _id: string;
}