import { Document } from 'mongoose';

import { WorkComment } from '@dragonfish/shared/models/comments';

export interface WorkCommentDocument extends WorkComment, Document {
    readonly _id: string;
}
