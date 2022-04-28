import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { MessageThreadsDocument } from '$modules/messages/db/schemas';
import { EditThreadForm, NewMessageForm } from '$shared/models/messages';

@Injectable()
export class MessageThreadsStore {
    constructor(
        @InjectModel('MessageThread')
        private readonly threads: PaginateModel<MessageThreadsDocument>,
    ) {}

    async fetchThreads(pseudId: string): Promise<PaginateResult<MessageThreadsDocument>> {
        return await this.threads.paginate(
            {
                participants: { $in: [pseudId] },
                deletedAt: null,
            },
            {
                sort: { createdAt: -1 },
                pagination: false,
                populate: 'participants',
            },
        );
    }

    async fetchOneThread(threadId: string, pseudId: string): Promise<MessageThreadsDocument> {
        return await this.threads.findOne({
            _id: threadId,
            participants: { $in: [pseudId] },
            deletedAt: null,
        });
    }

    /**
     * Checks to see if there's an existing private thread between two users.
     * @param pseudId
     * @param recipientId
     */
    async checkThreadWithUsers(
        pseudId: string,
        recipientId: string,
    ): Promise<MessageThreadsDocument> {
        return await this.threads.findOne({
            participants: { $in: [pseudId, recipientId], $size: 2 },
            deletedAt: null,
        });
    }

    /**
     * Checks to see if a thread exists.
     * @param threadId
     * @param pseudId
     */
    async checkThreadWithId(threadId: string, pseudId: string): Promise<MessageThreadsDocument> {
        return await this.threads.findOne({
            _id: threadId,
            participants: { $in: [pseudId] },
            deletedAt: null,
        });
    }

    async createThread(newMessage: NewMessageForm): Promise<MessageThreadsDocument> {
        const newThread = new this.threads({
            participants: [newMessage.senderId, newMessage.recipientId],
            name: newMessage.name,
        });

        return await newThread.save();
    }

    async editThreadInfo(threadInfo: EditThreadForm): Promise<MessageThreadsDocument> {
        const thread: MessageThreadsDocument = await this.threads.findOne({
            _id: threadInfo.threadId,
            participants: { $in: [threadInfo.pseudId] },
        });

        thread.name = threadInfo.name;

        return await thread.save();
    }
}
