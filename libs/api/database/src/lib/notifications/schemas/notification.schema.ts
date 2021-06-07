import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true, autoIndex: true, collection: 'notifications' })
export class NotificationDocument extends Document {
    @Prop({ default: () => nanoid() })
    readonly _id: string;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDocument);
