import { Logger } from '@nestjs/common';
import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueError,
    OnQueueFailed,
    OnQueuePaused,
    OnQueueWaiting,
    Process,
    Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationKind } from '@dragonfish/shared/models/accounts/notifications';
import { ContentCommentJob } from '@dragonfish/shared/models/accounts/notifications/jobs';
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

    @OnQueuePaused()
    onQueuePaused() {
        this.logger.log(`Queue has paused.`);
    }

    @OnQueueWaiting()
    onQueueWaiting(jobId: number) {
        this.logger.log(`Job ${jobId} is waiting for a worker...`);
    }

    @OnQueueCompleted()
    onQueueCompleted(job: Job) {
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
    async addedContentComment(job: Job<ContentCommentJob>) {
        this.logger.log(`Job ${job.id} (ContentComment) received!`);
        if (job.data.poster._id !== job.data.recipientId) {
            return await this.notifications.createNotification(job.data, NotificationKind.ContentComment);
        } else {
            return {};
        }
    }
}
