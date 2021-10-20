import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';
import { ContentUpdatedNotification } from '@dragonfish/shared/models/accounts/notifications/content';

@Schema()
export class ContentUpdatedDocument extends Document implements ContentUpdatedNotification {
    readonly _id: string;
    readonly recipientId: string;

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

    @Prop(
        raw({
            sectionTitle: { type: String, trim: true, required: true },
        }),
    )
    readonly sectionInfo: {
        readonly sectionTitle: string;
    };

    markedAsRead: boolean;
    readonly kind: NotificationKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const ContentUpdatedSchema = SchemaFactory.createForClass(ContentUpdatedDocument);
