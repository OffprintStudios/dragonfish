import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ContentNewNotification } from '$shared/models/notifications/content';
import { NotificationKind } from '$shared/models/notifications';
import { ContentKind } from '$shared/models/content';

@Schema()
export class ContentNewDocument extends Document implements ContentNewNotification {
    readonly _id: string;
    readonly recipientId: string;

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

    @Prop(
        raw({
            authorId: { type: String, ref: 'Pseudonym', required: true },
            authorName: { type: String, trim: true, required: true },
        }),
    )
    readonly authorInfo: {
        readonly authorId: string;
        readonly authorName: string;
    };

    markedAsRead: boolean;
    readonly kind: NotificationKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const ContentNewSchema = SchemaFactory.createForClass(ContentNewDocument);
