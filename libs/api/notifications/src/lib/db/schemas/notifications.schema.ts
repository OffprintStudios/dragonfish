import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true, autoIndex: true, discriminatorKey: 'kind' })
export class NotificationsDocument extends Document {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'Pseudonym', required: true })
    readonly recipientId: string;

    @Prop({ type: Boolean, default: false })
    markedAsRead: boolean;

    @Prop()
    readonly kind: string;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const NotificationsSchema = SchemaFactory.createForClass(NotificationsDocument);
