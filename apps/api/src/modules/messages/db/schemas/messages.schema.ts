import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true, autoIndex: true, collection: 'messages' })
export class MessagesDocument extends Document {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'MessageThread', required: true, index: true })
    readonly threadId: string;

    @Prop({ type: String, ref: 'Pseudonym', required: true })
    readonly user: string;

    @Prop({ required: true })
    message: string;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const MessagesSchema = SchemaFactory.createForClass(MessagesDocument);
