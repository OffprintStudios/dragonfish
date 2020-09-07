import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { MessageDocument } from './message.schema';
import { MessageThreadDocument } from './message-thread.schema';

import { sanitizeHtml } from '@pulp-fiction/html_sanitizer';
import { CreateInitialMessage, CreateResponse } from '@pulp-fiction/models/messages';
import { isNullOrUndefined } from '../../util';

@Injectable()
export class MessagesService {
    constructor(@InjectModel('Message') private readonly messageModel: PaginateModel<MessageDocument>,
                @InjectModel('MessageThread') private readonly messageThreadModel: PaginateModel<MessageThreadDocument>) {}

    /**
     * Creates a new thread with one other user.
     * 
     * @param user The user creating the thread
     * @param initialMessage The first message of said thread
     */
    async createNewPrivateThread(user: any, initialMessage: CreateInitialMessage) {
        const newThread = new this.messageThreadModel({
            name: initialMessage.name,
            users: [user.sub, initialMessage.recipient],
        });

        await newThread.save().then(async doc => {
            const newMessage = new this.messageModel({
                threadId: doc._id,
                user: user.sub,
                body: sanitizeHtml(initialMessage.body)
            });

            await newMessage.save();
        });
    }

    /**
     * Creates a response for a thread.
     * 
     * @param user The user responding
     * @param response Their response
     */
    async createResponse(user: any, response: CreateResponse) {
        const newResponse = new this.messageModel({
            threadId: response.threadId,
            user: user.sub,
            body: sanitizeHtml(response.body)
        });

        return await newResponse.save();
    }

    /**
     * Fetches the paginated list of threads in which a user is
     * involved.
     * 
     * @param user The user who's part of these threads
     * @param pageNum The current page of threads
     */
    async fetchThreads(user: any, pageNum: number) {
        return await this.messageThreadModel.paginate({'users': user.sub, 'audit.isDeleted': false}, {
            sort: {'updatedAt': -1},
            page: pageNum,
            limit: 15
        });
    }
}
