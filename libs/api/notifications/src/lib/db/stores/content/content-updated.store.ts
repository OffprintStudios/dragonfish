import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentUpdatedDocument } from '../../schemas';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';

@Injectable()
export class ContentUpdatedStore {
    constructor(
        @InjectModel(NotificationKind.ContentUpdate) private readonly contentUpdated: Model<ContentUpdatedDocument>,
    ) {}

    public async create(recipientId: string, contentId: string): Promise<ContentUpdatedDocument> {
        const newNotification = new this.contentUpdated({
            recipientId,
            contentId,
        });

        return await newNotification.save();
    }

    public async markAsRead(recipientId: string, contentId: string) {
        return this.contentUpdated.updateMany({ recipientId, contentId }, { markedAsRead: true });
    }
}
