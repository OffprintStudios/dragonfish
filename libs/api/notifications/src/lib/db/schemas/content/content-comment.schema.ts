import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ContentCommentNotification } from '@dragonfish/shared/models/accounts/notifications/content';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';

@Schema()
export class ContentCommentDocument extends Document implements ContentCommentNotification {
    readonly _id: string;
    readonly recipientId: string;

    @Prop(
        raw({
            page: { type: Number, required: true },
            commentId: { type: String, ref: 'Comment', required: true },
        }),
    )
    readonly commentInfo: {
        readonly page: number;
        readonly commentId: string;
    };

    @Prop(
        raw({
            contentId: { type: String, ref: 'Content', required: true },
            contentTitle: { type: String, trim: true, required: true },
        }),
    )
    readonly contentInfo: {
        readonly contentId: string;
        readonly contentTitle: string;
    };

    markedAsRead: boolean;
    readonly kind: NotificationKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const ContentCommentSchema = SchemaFactory.createForClass(ContentCommentDocument);
