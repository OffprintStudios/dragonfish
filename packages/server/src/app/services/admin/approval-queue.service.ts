import { Injectable, Logger } from '@nestjs/common';
import { ApprovalQueue } from '@dragonfish/models/approval-queue';
import { PaginateResult } from 'mongoose';

import { ContentKind, ContentModel } from '@dragonfish/models/content';
import { ApprovalQueueService as ApprovalQueueServiceDb } from '../../db/approval-queue/approval-queue.service';
import { ContentService } from '../../db/content';

@Injectable()
export class ApprovalQueueService {
    private readonly logger: Logger = new Logger(ApprovalQueueService.name);

    constructor(private approvalQueueService: ApprovalQueueServiceDb, private contentService: ContentService) {}

    /**
     * Fetches the entire queue.
     */
    async getQueue(pageNum: number): Promise<PaginateResult<ApprovalQueue>> {
        return await this.approvalQueueService.fetchAll(pageNum);
    }

    /**
     * Fetches all claimed queue items associated with this user.
     *
     * @param user The claimant
     */
    async getQueueForMod(user: any, pageNum: number): Promise<PaginateResult<ApprovalQueue>> {
        return await this.approvalQueueService.fetchForMod(user, pageNum);
    }

    /**
     * Claims a queue item for a user
     *
     * @param user The user claiming this work for review
     * @param docId The document ID of the queue entry
     */
    async claimWork(user: any, docId: string): Promise<ApprovalQueue> {
        return await this.approvalQueueService.claimWork(user, docId);
    }

    /**
     * Approves a work and then removes it from the Approval Queue
     *
     * @param user The claimant
     * @param docId The queue document
     * @param workId The work to approve
     * @param authorId The author of the work
     */
    async approveWork(user: any, docId: string, workId: string, authorId: string): Promise<void> {
        return await this.contentService.approveWork(docId, user.sub, workId, authorId);
    }

    /**
     * Rejects a work and then removes it from the Approval Queue
     *
     * @param user The claimant
     * @param docId The queue document
     * @param workId The work to reject
     * @param authorId The author of the work
     */
    async rejectWork(user: any, docId: string, workId: string, authorId: string): Promise<void> {
        return await this.contentService.rejectWork(docId, user.sub, workId, authorId);
    }

    /**
     * Fetches a piece of content for review.
     *
     * @param contentId The content ID
     * @param kind The content kind
     * @param userId The user associated with this work
     */
    async fetchOne(contentId: string, kind: ContentKind, userId: string): Promise<ContentModel> {
        return await this.contentService.fetchOnePending(contentId, kind, userId);
    }
}
