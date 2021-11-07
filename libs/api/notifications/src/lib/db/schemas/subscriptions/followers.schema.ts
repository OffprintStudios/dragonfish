import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Subscription, SubscriptionKind } from '@dragonfish/shared/models/accounts/notifications';

@Schema()
export class FollowersDocument extends Document implements Subscription {
    readonly _id: string;

    @Prop({ type: String, ref: 'Pseudonym', required: true, index: true })
    readonly itemId: string;

    @Prop({ type: String, ref: 'Pseudonym', required: true, index: true })
    readonly subscriberId: string;

    readonly kind: SubscriptionKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const FollowersSchema = SchemaFactory.createForClass(FollowersDocument);
