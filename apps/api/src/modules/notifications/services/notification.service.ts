import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ContentStore } from '$modules/content';
import { NotificationKind, SubscriptionKind } from '$shared/models/notifications';
import {
    AddedToLibraryPayload,
    CommentReplyPayload,
    ContentCommentPayload,
    ContentUpdatedPayload,
} from '$shared/models/notifications/payloads';
import {
    AddedToLibraryJob,
    CommentReplyJob,
    ContentCommentJob,
    ContentUpdatedJob,
} from '$shared/models/notifications/jobs';
import { Pseudonym } from '$shared/models/accounts';
import { UserService } from '$modules/accounts';
import { SubscriptionsStore } from '../db/stores';

@Injectable()
export class NotificationService {
    private logger = new Logger('Notifications');

    constructor(
        @InjectQueue('notifications') private readonly queue: Queue,
        private readonly content: ContentStore,
        private readonly users: UserService,
        private readonly subscriptions: SubscriptionsStore,
    ) {}

    //#region ---EVENT HANDLERS---

    @OnEvent(NotificationKind.ContentComment, { async: true })
    private async handleContentComment(payload: ContentCommentPayload) {
        this.logger.log(`Received payload for type ${NotificationKind.ContentComment}`);

        const content = await this.content.fetchOne(payload.contentId, undefined, false);
        console.log(content);
        const job: ContentCommentJob = {
            recipientId: content.author as string,
            commentId: payload.commentId,
            poster: payload.poster,
            contentId: content._id,
            contentTitle: content.title,
            contentKind: content.kind,
        };

        this.logger.log(`Adding new job to queue...`);
        await this.queue.add(NotificationKind.ContentComment, job);

        this.logger.log(`Checking if comment replies to others...`);
        if (payload.repliesTo.length === 0) {
            this.logger.log(`No replies detected! Skipping...`);
        } else {
            this.logger.log(`Dispatching replies...`);

            const replyPayload: CommentReplyPayload = {
                threadId: content._id,
                threadTitle: content.title,
                repliesTo: payload.repliesTo,
                commentId: payload.commentId,
                poster: payload.poster,
            };

            await this.handleCommentReplies(replyPayload);
        }
    }

    @OnEvent(NotificationKind.AddedToLibrary, { async: true })
    private async handleAddedToLibrary(payload: AddedToLibraryPayload) {
        this.logger.log(`Received payload for type ${NotificationKind.AddedToLibrary}`);

        const content = await this.content.fetchOne(payload.contentId, undefined, true);
        const job: AddedToLibraryJob = {
            recipientId: content.author as string,
            contentId: content._id,
            contentTitle: content.title,
            contentKind: content.kind,
            addedBy: await this.users.getOneUser(payload.addedById),
        };

        this.logger.log(`Adding new job to queue...`);
        await this.queue.add(NotificationKind.AddedToLibrary, job);
    }

    @OnEvent(NotificationKind.ContentUpdate, { async: true })
    private async handleContentUpdate(payload: ContentUpdatedPayload) {
        this.logger.log(`Received payload for type ${NotificationKind.ContentUpdate}`);

        const job: ContentUpdatedJob = {
            contentId: payload.contentId,
            subscribers: await this.subscriptions.fetchSubscribers(
                payload.contentId,
                SubscriptionKind.ContentLibrary,
            ),
        };

        this.logger.log(`Adding new job to queue...`);
        await this.queue.add(NotificationKind.ContentUpdate, job);
    }

    private async handleCommentReplies(payload: CommentReplyPayload) {
        this.logger.log(`Received payload of type ${NotificationKind.CommentReply}`);

        const job: CommentReplyJob = {
            recipients: payload.repliesTo,
            commentId: payload.commentId,
            threadId: payload.threadId,
            threadTitle: payload.threadTitle,
            poster: payload.poster,
        };

        this.logger.log(`Adding new job to queue...`);
        await this.queue.add(NotificationKind.CommentReply, job);
    }

    //#endregion
}
