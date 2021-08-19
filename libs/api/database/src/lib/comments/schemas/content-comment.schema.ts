import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CommentHistoryDocument } from './comment-history.scema';
import { ActionType } from '@dragonfish/shared/models/case-files';
import { CommentKind, ContentComment } from '@dragonfish/shared/models/comments';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Schema({ autoIndex: true })
export class ContentCommentDocument extends Document implements ContentComment {
    readonly _id: string;
    readonly user: string | Pseudonym;
    body: string;
    repliesTo: string[];
    history: CommentHistoryDocument[];
    audit: {
        isActioned: boolean;
        canEdit: boolean;
        action: ActionType;
        actionReason: string;
        actionedBy: string | Pseudonym;
    };
    readonly kind: CommentKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    @Prop({ type: String, ref: 'Content', required: true, index: true })
    readonly contentId: string;
}

export const ContentCommentSchema = SchemaFactory.createForClass(ContentCommentDocument);
