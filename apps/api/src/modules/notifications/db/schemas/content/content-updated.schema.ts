import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotificationKind } from '$shared/models/notifications';
import { ContentUpdatedNotification } from '$shared/models/notifications/content';

@Schema()
export class ContentUpdatedDocument extends Document implements ContentUpdatedNotification {
    readonly _id: string;
    readonly recipientId: string;

    @Prop({ type: String, ref: 'Content', required: true })
    readonly contentId: string;

    markedAsRead: boolean;
    readonly kind: NotificationKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const ContentUpdatedSchema = SchemaFactory.createForClass(ContentUpdatedDocument);
