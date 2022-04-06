import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { ApprovalQueueDocument } from '../schemas';

@Injectable()
export class ApprovalQueueStore {
    constructor(
        @InjectModel('ApprovalQueue')
        private readonly approvalQueue: PaginateModel<ApprovalQueueDocument>,
    ) {}

    /**
     * Adds a new entry to the Approval Queue
     *
     * @param contentId The work's ID
     */
    async addOneWork(contentId: string): Promise<void> {
        const newQueueEntry = new this.approvalQueue({
            workToApprove: contentId,
        });

        await newQueueEntry.save();
    }

    /**
     * Fetches the entire queue.
     */
    async fetchAll(): Promise<ApprovalQueueDocument[]> {
        return await this.approvalQueue
            .find()
            .sort({ createdAt: -1 })
            .populate({ path: 'workToApprove', populate: 'author' });
    }

    /**
     * Fetches all documents claimed by the specified moderator.
     *
     * @param pseudId The claimant
     * @param pageNum
     */
    async fetchForMod(
        pseudId: string,
        pageNum: number,
    ): Promise<PaginateResult<ApprovalQueueDocument>> {
        return await this.approvalQueue.paginate(
            { claimedBy: pseudId },
            {
                sort: { createdAt: -1 },
                page: pageNum,
                limit: 15,
                populate: { path: 'workToApprove', populate: 'author' },
            },
        );
    }

    /**
     * Fetch one that's been claimed by a specified mod
     * @param docId
     * @param modId
     */
    async fetchOneFromClaim(docId: string, modId: string): Promise<ApprovalQueueDocument> {
        return await this.approvalQueue.findOne({
            _id: docId,
            claimedBy: modId,
        });
    }

    /**
     * Claims a queue item for a user, throwing if only there's a conflict.
     *
     * @param pseudId The user claiming this work for review
     * @param docId The document ID of the queue entry
     */
    async claimWork(docId: string, pseudId: string): Promise<ApprovalQueueDocument> {
        const thisEntry = await this.approvalQueue.findById(docId);

        if (thisEntry.claimedBy === null) {
            return this.approvalQueue.findOneAndUpdate(
                { _id: docId },
                { claimedBy: pseudId },
                { new: true },
            );
        } else {
            throw new ConflictException(`Someone has already claimed this work!`);
        }
    }

    /**
     * Removes a queue document from the collection after it's been processed.
     *
     * @param docId The document to remove
     */
    async removeFromQueue(docId: string) {
        await this.approvalQueue.deleteOne({ _id: docId });
    }
}
