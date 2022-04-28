import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MessagesDocument } from '$modules/messages/db/schemas';
import { PaginateModel } from 'mongoose';
import { NewMessageForm, SendMessageForm } from '$shared/models/messages';

@Injectable()
export class MessagesStore {
    constructor(
        @InjectModel('Message') private readonly messages: PaginateModel<MessagesDocument>,
    ) {}

    async fetchMessages(threadId: string) {
        return await this.messages.paginate(
            { threadId: threadId },
            { sort: { createdAt: -1 }, pagination: false, populate: 'user' },
        );
    }

    async createMessage(
        threadId: string,
        newMessage: NewMessageForm | SendMessageForm,
    ): Promise<MessagesDocument> {
        const message = new this.messages({
            threadId: threadId,
            user: newMessage.senderId,
            message: newMessage.message,
        });

        return await message.save().then(async (data) => {
            return await this.messages.findOne({ _id: data._id }).populate('user');
        });
    }
}
