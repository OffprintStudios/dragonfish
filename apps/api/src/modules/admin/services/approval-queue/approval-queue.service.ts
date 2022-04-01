import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ApprovalQueueStore } from '../../db/stores';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OnEvent } from '@nestjs/event-emitter';
import {
    ApprovalQueue,
    ApprovalQueueEventsKind,
    SubmitToQueueJob,
    SubmitToQueuePayload,
} from '$shared/models/admin/approval-queue';
import { ContentService } from '$modules/content/services';
import { PubStatus } from '$shared/models/content';

@Injectable()
export class ApprovalQueueService {
    private logger = new Logger(`ApprovalQueue`);

    constructor(
        @InjectQueue('approval-queue') private readonly queue: Queue,
        private readonly store: ApprovalQueueStore,
        private readonly content: ContentService,
    ) {}

    //#region ---EVENT HANDLERS---

    @OnEvent(ApprovalQueueEventsKind.SubmitToQueue, { async: true })
    private async handleSubmitToQueue(payload: SubmitToQueuePayload) {
        this.logger.log(`Received payload of type ${ApprovalQueueEventsKind.SubmitToQueue}`);

        const job: SubmitToQueueJob = {
            content: payload.content,
        };

        this.logger.log(`Adding new job to queue...`);
        await this.queue.add(ApprovalQueueEventsKind.SubmitToQueue, job);
    }

    //#endregion

    public async approveWork(
        docId: string,
        userId: string,
        contentId: string,
        authorId: string,
    ): Promise<void> {
        const queueDoc = await this.store.fetchOneFromClaim(docId, userId);

        if (queueDoc) {
            await this.store.removeFromQueue(queueDoc._id).then(async () => {
                await this.content.updatePublishStatus(authorId, contentId, PubStatus.Published);
            });
        } else {
            throw new NotFoundException(`The document you're trying to find does not exist.`);
        }
    }

    public async rejectWork(
        docId: string,
        userId: string,
        contentId: string,
        authorId: string,
    ): Promise<void> {
        const queueDoc = await this.store.fetchOneFromClaim(docId, userId);

        if (queueDoc) {
            await this.store.removeFromQueue(queueDoc._id).then(async () => {
                await this.content.updatePublishStatus(authorId, contentId, PubStatus.Unpublished);
            });
        } else {
            throw new NotFoundException(`The document you're trying to find does not exist.`);
        }
    }

    public async claimDoc(docId: string, userId: string): Promise<ApprovalQueue> {
        return await this.store.claimWork(docId, userId);
    }

    public async fetchQueue(): Promise<ApprovalQueue[]> {
        return await this.store.fetchAll();
    }
}
