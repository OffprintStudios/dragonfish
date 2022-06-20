import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NewMessageNotification } from '$shared/models/notifications/messages';
import { NotificationKind } from '$shared/models/notifications';

@Schema()
export class NewMessageDocument extends Document implements NewMessageNotification {
    readonly _id: string;
    readonly recipientId: string;

    @Prop({ type: String, ref: 'MessageThread' })
    threadId: string;

    @Prop(
        raw({
            screenName: { type: String, required: true },
            avatar: { type: String, required: true },
        }),
    )
    senderInfo: {
        screenName: string;
        avatar: string;
    };

    markedAsRead: boolean;
    readonly kind: NotificationKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const NewMessageSchema = SchemaFactory.createForClass(NewMessageDocument);
