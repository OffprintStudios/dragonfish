import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as documents from './models/approval-queue-document.model';
import { WorksService } from '../works/works.service';
import { Categories } from 'shared/models/works';

@Injectable()
export class ApprovalQueueService {
    constructor(@InjectModel('ApprovalQueue') private readonly approvalQueue: Model<documents.ApprovalQueueDocument>,
        private readonly worksService: WorksService) {}

    /**
     * Adds a new entry to the Approval Queue
     * 
     * @param user The author of the work
     * @param workId The work's ID
     */
    async addOneWork(user: any, workId: string): Promise<documents.ApprovalQueueDocument> {
        const verifiedWork = await this.worksService.fetchOneUserWorkForQueue(user, workId);
        if (verifiedWork.meta.category !== Categories.Poetry && verifiedWork.stats.totWords < 750) {
            throw new BadRequestException(`Works need to have a minimum published word count of 750.`);
        } else {
            const newQueueEntry = new this.approvalQueue({
                workToApprove: verifiedWork._id,
            });
            return await this.worksService.pendingWork(verifiedWork._id, user.sub).then(async () => {
                return await newQueueEntry.save();
            });
        }
    }

    /**
     * Fetches the entire queue.
     */
    async fetchAll(): Promise<documents.ApprovalQueueDocument[]> {
        return await this.approvalQueue.find();
    }

    /**
     * Fetches all documents claimed by the specified moderator.
     * 
     * @param user The claimant
     */
    async fetchForMod(user: any): Promise<documents.ApprovalQueueDocument[]> {
        return await this.approvalQueue.find().where("claimedBy", user.sub);
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
