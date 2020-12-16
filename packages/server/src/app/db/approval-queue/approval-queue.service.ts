import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult } from 'mongoose';

import { ApprovalQueueDocument } from './approval-queue.schema';
import { WorksService } from '../works/works.service';
import { Categories } from '@pulp-fiction/models/works';
import { ContentModel } from '@pulp-fiction/models/content';

@Injectable()
export class ApprovalQueueService {
    constructor(@InjectModel('ApprovalQueue') private readonly approvalQueue: PaginateModel<ApprovalQueueDocument>,
        private readonly worksService: WorksService) {}

    /**
     * Adds a new entry to the Approval Queue
     * 
     * @param user The author of the work
     * @param contentId The work's ID
     */
    async addOneWork(contentId: string): Promise<void> {
        const newQueueEntry = new this.approvalQueue({
            workToApprove: contentId
        });

        await newQueueEntry.save();
    }

    /**
     * Fetches the entire queue.
     */
    async fetchAll(pageNum: number): Promise<PaginateResult<ApprovalQueueDocument>> {
        return await this.approvalQueue.paginate({}, {
            sort: {'createdAt': -1},
            page: pageNum,
            limit: 15
        });
    }

    /**
     * Fetches all documents claimed by the specified moderator.
     * 
     * @param user The claimant
     */
    async fetchForMod(user: any, pageNum: number): Promise<PaginateResult<ApprovalQueueDocument>> {
        return await this.approvalQueue.paginate({'claimedBy': user.sub}, {
            sort: {'createdAt': -1},
            page: pageNum,
            limit: 15
        });
    }

    /**
     * Claims a queue item for a user, throwing if only there's a conflict.
     * 
     * @param user The user claiming this work for review
     * @param docId The document ID of the queue entry
     */
    async claimWork(user: any, docId: string): Promise<void> {
        const thisEntry = await this.approvalQueue.findById(docId);

        if (thisEntry.claimedBy === null) {
            await this.approvalQueue.updateOne({'_id': docId}, {'claimedBy': user.sub});
        } else {
            throw new ConflictException(`Someone has already claimed this work!`);
        }
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
        await this.worksService.approveWork(workId, authorId).then(async () => {
            await this.approvalQueue.deleteOne({"_id": docId, "claimedBy": user.sub});
        });
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
        await this.worksService.rejectWork(workId, authorId).then(async () => {
            await this.approvalQueue.deleteOne({"_id": docId, "claimedBy": user.sub});
        });
    }
}
