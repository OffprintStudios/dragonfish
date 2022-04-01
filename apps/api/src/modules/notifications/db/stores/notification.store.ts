import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { NotificationDocument } from '../schemas';
import {
    AddedToLibraryJob,
    CommentReplyDBJob,
    ContentCommentJob,
    JobType,
} from '$shared/models/notifications/jobs';
import { NotificationKind } from '$shared/models/notifications';
import { AddedToLibraryStore, ContentUpdatedStore } from './content';
import { ContentCommentStore, CommentReplyStore } from './comments';

@Injectable()
export class NotificationStore {
    constructor(
        @InjectModel('Notification')
        private readonly notifications: PaginateModel<NotificationDocument>,
        private readonly contentComment: ContentCommentStore,
        private readonly commentReply: CommentReplyStore,
        private readonly addedToLibrary: AddedToLibraryStore,
        private readonly contentUpdated: ContentUpdatedStore,
    ) {}

    /**
     * Takes the incoming notification info and routes it to the correct creation function,
     * based on the notification's `NotificationKind`.
     *
     * @param job
     * @param kind
     */
    public async notifyOne(job: JobType, kind: NotificationKind): Promise<NotificationDocument> {
        switch (kind) {
            case NotificationKind.ContentComment:
                return await this.contentComment.create(job as ContentCommentJob);
            case NotificationKind.CommentReply:
                return await this.commentReply.create(job as CommentReplyDBJob);
            case NotificationKind.AddedToLibrary:
                return await this.addedToLibrary.create(job as AddedToLibraryJob);
            default:
                return;
        }
    }

    public async notifySubscriber(recipientId: string, itemId: string, kind: NotificationKind) {
        switch (kind) {
            case NotificationKind.ContentUpdate:
                return await this.contentUpdated.create(recipientId, itemId);
            default:
                return;
        }
    }

    /**
     * Fetches all unread notifications for a user.
     *
     * @param userId
     */
    public async fetchAllUnread(userId: string) {
        return this.notifications.find({ recipientId: userId }).where({ markedAsRead: false });
    }

    /**
     * Fetches all read notifications for a user.
     *
     * @param userId
     */
    public async fetchAllRead(userId: string) {
        return this.notifications.find({ recipient: userId }).where({ markedAsRead: true });
    }

    /**
     * Marks a set of notification IDs as read, filtered by the recipient's ID.
     *
     * @param userId
     * @param ids
     */
    public async markAsRead(userId: string, ids: string[]): Promise<void> {
        const query = { _id: { $in: ids }, recipientId: userId };
        await this.notifications.updateMany(query, { $set: { markedAsRead: true } });
    }
}
