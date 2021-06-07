import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { NotificationKind } from '@dragonfish/shared/models/notifications';

@Schema({ autoIndex: true, timestamps: true, collection: 'notification_subscriptions' })
export class NotificationSubscriptionDocument extends Document {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'User', index: true, required: true })
    readonly userId: string;

    @Prop({ required: true, index: true })
    readonly sourceId: string;

    @Prop({ type: String, enum: Object.keys(NotificationKind), required: true })
    readonly kind: NotificationKind;
}

export const NotificationSubscriptionSchema = SchemaFactory.createForClass(NotificationSubscriptionDocument);
