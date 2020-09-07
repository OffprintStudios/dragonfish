import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { MessageDocument } from './message.schema';
import { MessageThreadDocument } from './message-thread.schema';

import { CreateInitialMessage, CreateResponse } from '@pulp-fiction/models/messages';

@Injectable()
export class MessagesService {
    constructor(@InjectModel('Message') private readonly messageModel: PaginateModel<MessageDocument>,
                @InjectModel('MessageThread') private readonly messageThreadModel: PaginateModel<MessageThreadDocument>) {}

    async createNewThread(user: any, initialMessage: CreateInitialMessage) {
        
    }
}
