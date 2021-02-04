import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';

import { MessageDocument } from './message.schema';
import { MessageThreadDocument } from './message-thread.schema';

import * as sanitizeHtml from 'sanitize-html';
import { CreateInitialMessage, CreateResponse } from '@dragonfish/models/messages';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel('Message') private readonly messageModel: PaginateModel<MessageDocument>,
        @InjectModel('MessageThread') private readonly messageThreadModel: PaginateModel<MessageThreadDocument>,
    ) {}

    /**
     * Creates a new thread with one other user.
     *
     * @param user The user creating the thread
     * @param initialMessage The first message of said thread
     */
    async createNewPrivateThread(user: any, initialMessage: CreateInitialMessage): Promise<void> {
        const newThread = new this.messageThreadModel({
            name: sanitizeHtml(initialMessage.name),
            users: [user.sub, initialMessage.recipient],
        });

        await newThread.save().then(async (doc) => {
            const newMessage = new this.messageModel({
                threadId: doc._id,
                user: user.sub,
                body: sanitizeHtml(initialMessage.body),
            });

            await newMessage.save().then(async () => {
                await this.messageThreadModel.findByIdAndUpdate(doc._id, {
                    $inc: { 'meta.numMessages': 1 },
                    'meta.userWhoRepliedLast': user.sub,
                    'meta.lastMessage': sanitizeHtml(initialMessage.body),
                });
            });
        });
    }

    /**
     * Creates a response for a thread.
     *
     * @param user The user responding
     * @param response Their response
     */
    async createResponse(user: any, response: CreateResponse): Promise<MessageDocument> {
        const newResponse = new this.messageModel({
            threadId: response.threadId,
            user: user.sub,
            body: sanitizeHtml(response.body),
        });

        return await newResponse.save().then(async (doc) => {
            await this.messageThreadModel.findByIdAndUpdate(response.threadId, {
                $inc: { 'meta.numMessages': 1 },
                'meta.userWhoRepliedLast': user.sub,
            });

            return doc;
        });
    }

    /**
     * Fetches the paginated list of threads in which a user is
     * involved.
     *
     * @param user The user who's part of these threads
     * @param pageNum The current page of threads
     */
    async fetchThreads(user: any, pageNum: number): Promise<PaginateResult<MessageThreadDocument>> {
        return await this.messageThreadModel.paginate(
            { users: user.sub, 'audit.isDeleted': false },
            {
                sort: { updatedAt: -1 },
                page: pageNum,
                limit: 15,
            },
        );
    }

    /**
     * Fetches a small subset of active conversations, sorted by update date.
     *
     * @param user The user who's part of these threads
     */
    async fetchSidenavThreads(user: any): Promise<MessageThreadDocument[]> {
        return await this.messageThreadModel
            .find({ users: user.sub, 'audit.isDeleted': false })
            .sort({ updatedAt: -1 })
            .limit(7);
    }
}
