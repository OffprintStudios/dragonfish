import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { Notification, NotificationKind } from '@dragonfish/shared/models/accounts/notifications';

@Schema({ timestamps: true, autoIndex: true, collection: 'notifications', discriminatorKey: 'kind' })
export class NotificationDocument extends Document implements Notification {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'Pseudonym', required: true, index: true })
    readonly recipientId: string;

    @Prop({ type: Boolean, default: false })
    markedAsRead: boolean;

    @Prop({ type: String, enum: Object.keys(NotificationKind), required: true, index: true })
    readonly kind: NotificationKind;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDocument);
