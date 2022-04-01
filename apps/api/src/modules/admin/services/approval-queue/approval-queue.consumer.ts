import { Logger } from '@nestjs/common';
import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueError,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { ApprovalQueueStore } from '../../db/stores';
import { ApprovalQueueEventsKind, SubmitToQueueJob } from '$shared/models/admin/approval-queue';
import { ContentService } from '$modules/content/services';
import { Pseudonym } from '$shared/models/accounts';
import { PubStatus } from '$shared/models/content';

@Processor('approval-queue')
export class ApprovalQueueConsumer {
    private logger = new Logger(`ApprovalQueueProcessor`);

    constructor(
        private readonly store: ApprovalQueueStore,
        private readonly content: ContentService,
    ) {}

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

    @Process(ApprovalQueueEventsKind.SubmitToQueue)
    async submittedToQueue(job: Job<SubmitToQueueJob>, done: DoneCallback) {
        this.logger.log(`Job ${job.id} (SubmitToQueue) received!`);
        const content = job.data.content;

        await this.store.addOneWork(content._id).then(async () => {
            await this.content.updatePublishStatus(
                (content.author as Pseudonym)._id,
                content._id,
                PubStatus.Pending,
            );
        });

        done();
    }
}
