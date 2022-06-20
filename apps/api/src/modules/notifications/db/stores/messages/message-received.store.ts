import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationKind } from '$shared/models/notifications';
import { Model } from 'mongoose';
import { NewMessageDocument } from '$modules/notifications/db/schemas';
import { NewMessageDbPayload } from '$shared/models/notifications/db-payloads';

@Injectable()
export class MessageReceivedStore {
    constructor(
        @InjectModel(NotificationKind.MessageReceived) private readonly messages: Model<NewMessageDocument>,
    ) {}

    async create(payload: NewMessageDbPayload) {
        const newNotification = new this.messages({
            recipientId: payload.recipientId,
            threadId: payload.threadId,
            'senderInfo.screenName': payload.senderScreenName,
            'senderInfo.avatar': payload.senderAvatar,
        });

        return await newNotification.save();
    }
}
