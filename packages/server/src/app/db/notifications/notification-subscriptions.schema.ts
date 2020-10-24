import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { NotificationSubscription } from '@pulp-fiction/models/notifications';
import { Document } from 'mongoose';

@Schema({
    autoIndex: true    
})
export class NotificationSubscriptionDocument extends Document implements NotificationSubscription {
    @Prop({required: true, index: true})
    notificationSourceId: string;

    @Prop({required: true, index: true})
    userId: string;
}

export const NotificationSubscriptionSchema = SchemaFactory.createForClass(NotificationSubscriptionDocument);