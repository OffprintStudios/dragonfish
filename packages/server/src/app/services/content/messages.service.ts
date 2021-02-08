import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { MessagesStore } from '../../db/messages/messages.store';
import { IMessages } from '../../shared/content';
import { MessageThread, Message, CreateInitialMessage, CreateResponse } from '@dragonfish/models/messages';

@Injectable()
export class MessagesService implements IMessages {
    constructor (private readonly messages: MessagesStore) {}

    async createNewPrivateThread(user: any, initialMessage: CreateInitialMessage): Promise<void> {
        return await this.messages.createNewPrivateThread(user, initialMessage);
    }

    async createResponse(user: any, response: CreateResponse): Promise<Message> {
        return await this.messages.createResponse(user, response);
    }

    async fetchThreads(user: any, pageNum: number): Promise<PaginateResult<MessageThread>> {
        return await this.messages.fetchThreads(user, pageNum);
    }

    async fetchSidenavThreads(user: any): Promise<MessageThread[]> {
        return await this.messages.fetchSidenavThreads(user);
    }
}