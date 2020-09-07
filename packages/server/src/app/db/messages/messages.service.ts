import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { MessageDocument } from './message.schema';
import { MessageThreadDocument } from './message-thread.schema';

@Injectable()
export class MessagesService {
    constructor(@InjectModel('Message') private readonly messageModel: PaginateModel<MessageDocument>,
                @InjectModel('MessageThread') private readonly messageThreadModel: PaginateModel<MessageThreadDocument>) {}

    
}
