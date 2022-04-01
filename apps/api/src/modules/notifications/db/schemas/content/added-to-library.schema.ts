import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AddedToLibraryNotification } from '$shared/models/notifications/content';
import { NotificationKind } from '$shared/models/notifications';
import { ContentKind } from '$shared/models/content';

@Schema()
export class AddedToLibraryDocument extends Document implements AddedToLibraryNotification {
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
            userId: { type: String, ref: 'Pseudonym', required: true },
            userTag: { type: String, trim: true, required: true },
            userName: { type: String, trim: true, required: true },
        }),
    )
    readonly addedByInfo: {
        readonly userId: string;
        readonly userTag: string;
        readonly userName: string;
    };

    markedAsRead: boolean;
    readonly kind: NotificationKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const AddedToLibrarySchema = SchemaFactory.createForClass(AddedToLibraryDocument);
