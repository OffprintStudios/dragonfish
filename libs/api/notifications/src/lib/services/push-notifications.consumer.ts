import { Logger } from '@nestjs/common';
import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('push-notifications')
export class PushNotificationsConsumer {
    private logger = new Logger(`PushNotificationsQueue`);

    //#region ---LIFECYCLE HOOKS---

    @OnQueueActive()
    onQueueActive(job: Job) {
        this.logger.log(`Processing job ${job.id}...`);
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

    @Process()
    async pushToUser(job: Job<unknown>) {
        this.logger.log(`Job ${job.id} received!`);
    }
}
