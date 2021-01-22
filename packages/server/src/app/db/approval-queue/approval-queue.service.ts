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
    async claimWork(user: any, docId: string): Promise<ApprovalQueueDocument> {
        const thisEntry = await this.approvalQueue.findById(docId);

        if (thisEntry.claimedBy === null) {
            return await this.approvalQueue.findOneAndUpdate({'_id': docId}, {'claimedBy': user.sub}, {new: true});
        } else {
            throw new ConflictException(`Someone has already claimed this work!`);
        }
    }

    /**
     * Removes a queue document from the collection after it's been processed.
     * 
     * @param docId The document to remove
     * @param claimedBy The user who claimed it
     */
    async removeFromQueue(docId: string, claimedBy: string) {
        await this.approvalQueue.deleteOne({'_id': docId, 'claimedBy': claimedBy});
    }
}
