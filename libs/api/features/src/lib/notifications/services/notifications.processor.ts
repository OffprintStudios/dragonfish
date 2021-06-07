import { Logger } from '@nestjs/common';
import { Processor, Process, OnQueueActive, OnQueueCompleted, OnQueueError } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationQueueModel } from '@dragonfish/shared/models/notifications';

@Processor('notifications')
export class NotificationsProcessor {
    private readonly logger = new Logger(NotificationsProcessor.name);

    @OnQueueActive()
    async onQueueActive(job: Job<NotificationQueueModel>) {
        this.logger.log(`Processing job ${job.id}...`);
    }

    @OnQueueCompleted()
    async onQueueCompleted(job: Job<NotificationQueueModel>) {
        this.logger.log(`Job ${job.id} has completed!`);
    }

    @OnQueueError()
    async onQueueError(job: Job<NotificationQueueModel>) {
        this.logger.log(
            `Job ${job.id} has encountered an error after ${job.attemptsMade} attempts!\nReason: ${job.failedReason}`,
        );
    }

    @Process('publish')
    async handlePublish(job: Job<NotificationQueueModel>) {
        //TODO: handle this
    }

    //#region ---PRIVATE---

    //#endregion
}
