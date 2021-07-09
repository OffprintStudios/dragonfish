import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HookNextFunction } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

import { MessageDocument, MessageSchema } from './message.schema';
import { MessageThreadDocument, MessageThreadSchema } from './message-thread.schema';
import { MessagesStore } from './messages.store';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'Message',
                useFactory: () => {
                    const schema = MessageSchema;
                    schema.plugin(require('mongoose-autopopulate'));
                    schema.plugin(require('mongoose-paginate-v2'));
                    schema.pre<MessageDocument>('save', async function (next: HookNextFunction) {
                        this.set('_id', uuidV4());
                        this.set('createdAt', new Date());
                        this.set('updatedAt', new Date());
                        return next();
                    });
                    return schema;
                },
            },
            {
                name: 'MessageThread',
                useFactory: () => {
                    const schema = MessageThreadSchema;
                    schema.plugin(require('mongoose-autopopulate'));
                    schema.plugin(require('mongoose-paginate-v2'));
                    schema.pre<MessageThreadDocument>('save', async function (next: HookNextFunction) {
                        this.set('_id', uuidV4());
                        this.set('createdAt', new Date());
                        this.set('updatedAt', new Date());
                        return next();
                    });
                    return schema;
                },
            },
        ]),
    ],
    exports: [MessagesStore],
    providers: [MessagesStore],
})
export class MessagesModule {}
