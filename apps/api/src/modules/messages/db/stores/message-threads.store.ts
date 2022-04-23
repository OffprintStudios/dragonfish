import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { MessageThreadsDocument } from '$modules/messages/db/schemas';

@Injectable()
export class MessageThreadsStore {
    constructor(
        @InjectModel('MessageThread')
        private readonly threads: PaginateModel<MessageThreadsDocument>,
    ) {}
}
