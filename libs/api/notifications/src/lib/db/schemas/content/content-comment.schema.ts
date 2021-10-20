import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ContentCommentNotification } from '@dragonfish/shared/models/accounts/notifications/content';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';
import { ContentKind } from '@dragonfish/shared/models/content';

@Schema()
export class ContentCommentDocument extends Document implements ContentCommentNotification {
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
            contentKind: { type: String, enum: Object.keys(ContentKind), required: true },
        }),
    )
    readonly contentInfo: {
        readonly contentId: string;
        readonly contentTitle: string;
        readonly contentKind: ContentKind;
    };

    markedAsRead: boolean;
    readonly kind: NotificationKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const ContentCommentSchema = SchemaFactory.createForClass(ContentCommentDocument);
