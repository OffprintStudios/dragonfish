import { Document } from 'mongoose';

import { WorkComment } from '@pulp-fiction/models/comments';

export interface WorkCommentDocument extends WorkComment, Document {
    readonly _id: string;
}