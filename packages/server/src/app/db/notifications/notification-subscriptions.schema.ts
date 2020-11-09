import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { NotificationSourceKind, NotificationSubscription } from '@pulp-fiction/models/notifications';
import { Document } from 'mongoose';

@Schema({
    autoIndex: true,
    collection: 'notification_subscriptions'
})
export class NotificationSubscriptionDocument extends Document implements NotificationSubscription {
    @Prop({required: true, index: true})
    userId: string;

    @Prop({required: true, index: true})
    notificationSourceId: string;

    @Prop({required: true, type: String, enum: Object.keys(NotificationSourceKind)})
    notificationSourceKind: NotificationSourceKind;
}

export const NotificationSubscriptionSchema = SchemaFactory.createForClass(NotificationSubscriptionDocument);