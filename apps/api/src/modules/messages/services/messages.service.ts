import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MessagesStore, MessageThreadsStore } from '$modules/messages/db/stores';
import { NewMessageForm, SendMessageForm } from '$shared/models/messages';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class MessagesService {
    constructor(
        private readonly threads: MessageThreadsStore,
        private readonly messages: MessagesStore,
    ) {}

    async fetchThreads(pseudId: string) {
        return await this.threads.fetchThreads(pseudId);
    }

    async fetchThread(threadId: string, pseudId: string) {
        return await this.threads.fetchOneThread(threadId, pseudId);
    }

    async fetchMessages(threadId: string, pseudId: string) {
        const thread = await this.threads.fetchOneThread(threadId, pseudId);

        if (thread) {
            return await this.messages.fetchMessages(threadId);
        } else {
            throw new UnauthorizedException(`You don't have permission to view this thread.`);
        }
    }

    async sendMessage(newMessage: SendMessageForm) {
        const existingThread = await this.threads.checkThreadWithId(
            newMessage.threadId,
            newMessage.senderId,
        );

        if (existingThread) {
            return await this.messages
                .createMessage(newMessage.threadId, newMessage)
                .then(async (res) => {
                    await this.threads.updateLastMessageOn(newMessage.threadId);
                    return res;
                });
        } else {
            throw new WsException(`You don't have permission to do that.`);
        }
    }

    async sendPrivateMessage(newMessage: NewMessageForm) {
        const existingThread = await this.threads.checkThreadWithUsers(
            newMessage.senderId,
            newMessage.recipientId,
        );

        if (existingThread) {
            return await this.messages.createMessage(existingThread._id, newMessage);
        } else {
            const newThread = await this.threads.createThread(newMessage);
            return await this.messages.createMessage(newThread._id, newMessage);
        }
    }
}
