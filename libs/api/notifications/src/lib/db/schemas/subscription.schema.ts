import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { Subscription } from '@dragonfish/shared/models/accounts/notifications';

@Schema({ timestamps: true, autoIndex: true, collection: 'subscriptions' })
export class SubscriptionDocument extends Document implements Subscription {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, required: true, index: true })
    readonly itemId: string;

    @Prop({ type: String, ref: 'Pseudonym', required: true, index: true })
    readonly subscriberId: string;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(SubscriptionDocument);
