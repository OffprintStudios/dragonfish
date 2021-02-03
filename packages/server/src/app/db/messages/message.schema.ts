import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

import { Message, MessageUser } from '@dragonfish/models/messages';

@Schema()
export class MessageDocument extends Document implements Message {
    @Prop({default: uuidV4()})
    readonly _id: string;

    @Prop({type: String, ref: 'MessageThread', required: true, index: true})
    readonly threadId: string;

    @Prop({type: String, ref: 'User', autopopulate: {
        select: '_id username profile.avatar audit.roles'
    }})
    readonly user: string | MessageUser;

    @Prop({required: true, trim: true})
    readonly body: string;

    @Prop(raw({
        isEdited: {type: Boolean, default: false}
    }))
    readonly audit: {
        readonly isEdited: boolean;
    };

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument);