import { Logger } from '@nestjs/common';
import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { Notification, NotificationKind } from '$shared/models/notifications';
import {
    AddedToLibraryJob,
    CommentReplyDBJob,
    CommentReplyJob,
    ContentCommentJob,
    ContentUpdatedJob,
    NewMessageJob,
} from '$shared/models/notifications/jobs';
import { NotificationStore } from '../db/stores';
import { ContentStore } from '$modules/content';
import { UserService } from '$modules/accounts';
import { ContentCommentDbPayload } from '$shared/models/notifications/db-payloads';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Processor('notifications')
export class NotificationConsumer {
    private logger = new Logger(`NotificationQueue`);

    constructor(
        private readonly notifications: NotificationStore,
        private readonly content: ContentStore,
        private readonly users: UserService,
        private readonly events: EventEmitter2,
    ) {}

    //#region ---LIFECYCLE HOOKS---

    @OnQueueActive()
    onQueueActive(job: Job) {
        this.logger.log(`Processing job ${job.id}...`);
    }

    @OnQueueCompleted()
    onQueueCompleted(job: Job, result: Notification) {
        this.logger.log(`Job ${job.id} completed! Pushing notification...`);
        if (result) {
            this.events.emit('activity:push-notification', result);
        }
    }

    @OnQueueFailed()
    onQueueFailed(job: Job, err: Error) {
        this.logger.error(`Job ${job.id} has failed to process! Error: ${err.message}`);
    }

    @OnQueueError()
    onQueueError(error: Error) {
        this.logger.error(`Queue has experienced an error! Message: ${error.message}`);
    }

    //#endregion

    @Process(NotificationKind.ContentComment)
    async addedContentComment(job: Job<ContentCommentJob>, done: DoneCallback) {
        this.logger.log(`Job ${job.id} (ContentComment) received!`);
        const content = await this.content.fetchOne(job.data.contentId, undefined, false);
        const poster = await this.users.getOneUser(job.data.posterId);
        if (poster._id !== (content.author as string)) {
            const dbPayload: ContentCommentDbPayload = {
                recipientId: content.author as string,
                commentId: job.data.commentId,
                content: {
                    id: content._id,
                    title: content.title,
                    kind: content.kind,
                },
                poster: {
                    id: poster._id,
                    name: poster.screenName,
                    tag: poster.userTag,
                },
            };
            const notification = await this.notifications.notifyOne(
                dbPayload,
                NotificationKind.ContentComment,
            );
            done(null, notification);
        } else {
            done();
        }
    }

    @Process(NotificationKind.CommentReply)
    async repliedToComment(job: Job<CommentReplyJob>, done: DoneCallback) {
        this.logger.log(`Job ${job.id} (CommentReply) received!`);

        for (const recipientId in job.data.recipients) {
            if (job.data.poster._id !== recipientId) {
                const newJob: CommentReplyDBJob = {
                    recipientId: recipientId,
                    commentId: job.data.commentId,
                    threadId: job.data.threadId,
                    threadTitle: job.data.threadTitle,
                    poster: job.data.poster,
                };
                const notification = await this.notifications.notifyOne(
                    newJob,
                    NotificationKind.CommentReply,
                );
                done(null, notification);
            }
        }

        done();
    }

    @Process(NotificationKind.AddedToLibrary)
    async addedToLibrary(job: Job<AddedToLibraryJob>, done: DoneCallback) {
        this.logger.log(`Job ${job.id} (AddedToLibrary) received!`);
        if (job.data.addedBy._id !== job.data.recipientId) {
            const notification = await this.notifications.notifyOne(
                job.data,
                NotificationKind.AddedToLibrary,
            );
            done(null, notification);
        } else {
            done();
        }
    }

    @Process(NotificationKind.ContentUpdate)
    async contentUpdate(job: Job<ContentUpdatedJob>, done: DoneCallback) {
        this.logger.log(`Job ${job.id} (ContentUpdate) received!`);

        for (const subscriber of job.data.subscribers) {
            await this.notifications.notifySubscriber(
                subscriber.subscriberId,
                job.data.contentId,
                NotificationKind.ContentUpdate,
            );
        }

        done();
    }

    @Process(NotificationKind.MessageReceived)
    async messageReceived(job: Job<NewMessageJob>, done: DoneCallback) {
        this.logger.log(`Job ${job.id} (MessageReceived) received!`);

        for (const recipient in job.data.recipients) {
            if (recipient !== job.data.senderId) {
                const notification = await this.notifications.notifyOne(
                    {
                        recipientId: recipient,
                        threadId: job.data.threadId,
                        senderId: job.data.senderId,
                        senderScreenName: job.data.senderScreenName,
                        senderAvatar: job.data.senderAvatar,
                    },
                    NotificationKind.MessageReceived,
                );
                this.events.emit('messages:update-feed', notification);
            }
        }

        done();
    }
}
