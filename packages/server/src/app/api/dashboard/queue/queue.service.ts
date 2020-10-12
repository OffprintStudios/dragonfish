import { BadRequestException, Injectable } from '@nestjs/common';
import { ApprovalQueueService } from '../../../db/approval-queue/approval-queue.service';
import { WorksService } from '../../../db/works/works.service';

@Injectable()
export class QueueService {
    constructor(private approvalQueueService: ApprovalQueueService,
        private worksService: WorksService) {}

    /**
     * Submits a work to the queue.
     * 
     * @param user The author of the work
     * @param workId The work's ID
     */
    async submitWork(user: any, workId: string) {
        let publishedSections = (await this.worksService.findOneWorkById(workId)).sections
            .filter(x => x.published);
        if (!publishedSections || publishedSections.length < 1) {
            throw new BadRequestException("Your work must contain at least one published section before it can be submitted.");
        }
        return await this.approvalQueueService.addOneWork(user, workId);
    }

    /**
     * Fetches the entire queue.
     */
    async getQueue(pageNum: number) {
        return await this.approvalQueueService.fetchAll(pageNum);
    }

    /**
     * Fetches all claimed queue items associated with this user.
     * 
     * @param user The claimant
     */
    async getQueueForMod(user: any, pageNum: number) {
        return await this.approvalQueueService.fetchForMod(user, pageNum);
    }

    /**
     * Claims a queue item for a user
     * 
     * @param user The user claiming this work for review
     * @param docId The document ID of the queue entry
     */
    async claimWork(user: any, docId: string) {
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
    async approveWork(user: any, docId: string, workId: string, authorId: string) {
        return await this.approvalQueueService.approveWork(user, docId, workId, authorId);
    }

    /**
     * Rejects a work and then removes it from the Approval Queue
     * 
     * @param user The claimant
     * @param docId The queue document
     * @param workId The work to reject
     * @param authorId The author of the work
     */
    async rejectWork(user: any, docId: string, workId: string, authorId: string) {
        return await this.approvalQueueService.rejectWork(user, docId, workId, authorId);
    }
}
