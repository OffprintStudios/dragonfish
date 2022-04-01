import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CommentReplyNotification } from '$shared/models/notifications/comments';
import { NotificationKind } from '$shared/models/notifications';

@Schema()
export class CommentReplyDocument extends Document implements CommentReplyNotification {
    readonly _id: string;
    readonly recipientId: string;

    @Prop(
        raw({
            commentId: { type: String, ref: 'Comment', required: true },
            posterName: { type: String, trim: true, required: true },
            posterId: { type: String, ref: 'Pseudonym', required: true },
            posterTag: { type: String, trim: true, required: true },
        }),
    )
    readonly commentInfo: {
        readonly commentId: string;
        readonly posterName: string;
        readonly posterId: string;
        readonly posterTag: string;
    };

    @Prop(
        raw({
            contentId: { type: String, ref: 'Content', required: true },
            contentTitle: { type: String, trim: true, required: true },
        }),
    )
    readonly threadInfo: {
        readonly threadId: string;
        readonly threadTitle: string;
    };

    markedAsRead: boolean;
    readonly kind: NotificationKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const CommentReplySchema = SchemaFactory.createForClass(CommentReplyDocument);
