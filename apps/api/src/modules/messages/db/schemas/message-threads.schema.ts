import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { MessageThread } from '$shared/models/messages';

@Schema({ timestamps: true, autoIndex: true, collection: 'message_threads' })
export class MessageThreadsDocument extends Document implements MessageThread {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: [String], ref: 'Pseudonym', required: true, index: true })
    participants: string[];

    @Prop({ required: true })
    name: string;

    @Prop({ default: null })
    threadIcon: string;

    @Prop({ default: 0 })
    numMessages: number;

    @Prop()
    lastMessageOn: Date;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;

    @Prop({ default: null })
    readonly deletedAt: Date;
}

export const MessageThreadsSchema = SchemaFactory.createForClass(MessageThreadsDocument);
