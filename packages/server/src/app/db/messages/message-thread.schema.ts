import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidV4} from 'uuid';

import { MessageThread, MessageThreadUser } from '@pulp-fiction/models/messages';

@Schema({timestamps: true, autoIndex: true, collection: 'message_threads'})
export class MessageThreadDocument extends Document implements MessageThread {
    @Prop({default: uuidV4()})
    readonly _id: string;

    @Prop({default: null})
    readonly name: string;

    @Prop({type: [String], ref: 'User', index: true, autopopulate: {
        select: '_id username profile.avatar audit.roles'
    }})
    readonly users: string[] | MessageThreadUser[];

    @Prop(raw({
        numMessages: {type: Number, default: 0},
        userWhoRepliedLast: {type: String, ref: 'User', default: null}
    }))
    readonly meta: {
        readonly numMessages: number;
        readonly userWhoRepliedLast: string;
    };

    @Prop(raw({
        isDeleted: {type: Boolean, default: false}
    }))
    readonly audit: {
        readonly isDeleted: boolean;
    };

    @Prop({default: new Date()})
    readonly createdAt: Date;

    @Prop({default: new Date()})
    readonly updatedAt: Date;
}

export const MessageThreadSchema = SchemaFactory.createForClass(MessageThreadDocument);