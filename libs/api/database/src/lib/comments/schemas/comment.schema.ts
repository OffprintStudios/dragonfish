import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { ActionType } from '@dragonfish/shared/models/case-files';
import { CommentHistoryDocument, CommentHistorySchema } from './comment-history.scema';
import { Comment, CommentKind } from '@dragonfish/shared/models/comments';
import { Constants } from '@dragonfish/shared/constants';

@Schema({ timestamps: true, collection: 'comments', autoIndex: true, discriminatorKey: 'kind' })
export class CommentDocument extends Document implements Comment {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({
        type: String,
        ref: 'User',
        required: true,
        index: true,
        autopopulate: {
            select: Constants.USER_QUERY,
        },
    })
    readonly user: string | FrontendUser;

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
                ref: 'User',
                default: null,
                autopopulate: {
                    select: Constants.USER_QUERY,
                },
            },
        }),
    )
    audit: {
        isActioned: boolean;
        canEdit: boolean;
        action: ActionType;
        actionReason: string;
        actionedBy: string | FrontendUser;
    };

    @Prop({ type: String, enum: Object.keys(CommentKind), required: true })
    readonly kind: CommentKind;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(CommentDocument);
