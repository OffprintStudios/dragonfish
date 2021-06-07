import { Logger } from '@nestjs/common';
import { Processor, Process, OnQueueActive, OnQueueCompleted, OnQueueWaiting, OnQueueError } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationQueueModel } from '@dragonfish/shared/models/notifications';

@Processor('notifications')
export class NotificationsProcessor {
    private readonly logger = new Logger(NotificationsProcessor.name);

    @OnQueueActive()
    async onQueueActive(job: Job<NotificationQueueModel>) {
        this.logger.debug(`Processing job ${job.id}...`);
    }

    @OnQueueCompleted()
    async onQueueCompleted(job: Job<NotificationQueueModel>) {
        this.logger.debug(`Job ${job.id} has completed!`);
    }

    @OnQueueWaiting()
    async onQueueWaiting() {
        this.logger.debug(`Queue is waiting for jobs...`);
    }

    @OnQueueError()
    async onQueueError(job: Job<NotificationQueueModel>) {
        this.logger.debug(
            `Job ${job.id} has encountered an error after ${job.attemptsMade} attempts!\nReason: ${job.failedReason}`,
        );
    }

    @Process('publish')
    async handlePublish(job: Job<NotificationQueueModel>) {
        //TODO: handle this
    }
}
