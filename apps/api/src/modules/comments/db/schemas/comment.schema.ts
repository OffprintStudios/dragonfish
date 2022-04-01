import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { ActionType } from '$shared/models/case-files';
import { CommentHistoryDocument, CommentHistorySchema } from './comment-history.schema';
import { Comment, CommentKind } from '$shared/models/comments';
import { Pseudonym } from '$shared/models/accounts';

@Schema({ timestamps: true, collection: 'comments', autoIndex: true, discriminatorKey: 'kind' })
export class CommentDocument extends Document implements Comment {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({
        type: String,
        ref: 'Pseudonym',
        required: true,
        index: true,
        autopopulate: true,
    })
    readonly user: string | Pseudonym;

    @Prop()
    body: string;

    @Prop({ type: [String], ref: 'Comments', default: [], index: true })
    repliesTo: string[];

    @Prop({ type: [CommentHistorySchema], default: [] })
    history: CommentHistoryDocument[];

    @Prop(
        raw({
            isActioned: { type: Boolean, default: false },
            canEdit: { type: Boolean, default: true },
            action: { type: String, enum: Object.keys(ActionType), default: 'None' },
            actionReason: { type: String, default: 'Created' },
            actionedBy: {
                type: String,
                ref: 'Pseudonym',
                default: null,
                autopopulate: true,
            },
        }),
    )
    audit: {
        isActioned: boolean;
        canEdit: boolean;
        action: ActionType;
        actionReason: string;
        actionedBy: string | Pseudonym;
    };

    @Prop({ type: String, enum: Object.keys(CommentKind), required: true })
    readonly kind: CommentKind;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(CommentDocument);
