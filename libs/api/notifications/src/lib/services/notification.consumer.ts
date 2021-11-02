import { Logger } from '@nestjs/common';
import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';
import { AddedToLibraryJob, ContentCommentJob } from '@dragonfish/shared/models/accounts/notifications/jobs';
import { NotificationStore } from '../db/stores';

@Processor('notifications')
export class NotificationConsumer {
    private logger = new Logger(`NotificationQueue`);

    constructor(private readonly notifications: NotificationStore) {}

    //#region ---LIFECYCLE HOOKS---

    @OnQueueActive()
    onQueueActive(job: Job) {
        this.logger.log(`Processing job ${job.id}...`);
    }

    @OnQueueCompleted()
    onQueueCompleted(job: Job, result) {
        this.logger.log(`Job ${job.id} completed!`);
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
        if (job.data.poster._id !== job.data.recipientId) {
            const notification = await this.notifications.createNotification(job.data, NotificationKind.ContentComment);
            done(null, notification);
        } else {
            done();
        }
    }

    @Process(NotificationKind.AddedToLibrary)
    async addedToLibrary(job: Job<AddedToLibraryJob>, done: DoneCallback) {}
}
