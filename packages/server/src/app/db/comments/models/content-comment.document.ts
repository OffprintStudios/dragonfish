import { Document } from 'mongoose';

import { ContentComment } from '@dragonfish/models/comments';

export interface ContentCommentDocument extends ContentComment, Document {
    readonly _id: string;
}
