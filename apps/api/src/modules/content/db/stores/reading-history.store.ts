import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from '$shared/auth';
import { Model } from 'mongoose';
import { ReadingHistoryDocument } from '../schemas';

/**
 * ## Reading History Store
 *
 * Functions that deal with fetching and updating reading history documents.
 */
@Injectable()
export class ReadingHistoryStore {
    constructor(
        @InjectModel('ReadingHistory') private readonly histModel: Model<ReadingHistoryDocument>,
    ) {}

    /**
     * Fetches all history documents belonging to one user.
     *
     * @param user The owner of these documents
     */
    async fetchUserHistory(user: JwtPayload): Promise<ReadingHistoryDocument[]> {
        return this.histModel.find({ owner: user.sub, visible: true }).sort({ viewedOn: -1 });
    }

    /**
     * Fetches one history document associated with both a user and some content.
     *
     * @param user The owner of the history document
     * @param contentId The content associated with it
     */
    async fetchOneHistoryDoc(user: JwtPayload, contentId: string): Promise<ReadingHistoryDocument> {
        return this.histModel.findOne(
            { owner: user.sub, content: contentId },
            { autopopulate: false },
        );
    }

    /**
     * Soft deletes a history document so it no longer shows up on frontend queries.
     *
     * @param user The owner of the history document
     * @param histIds The history documents themselves
     */
    async changeVisibility(user: JwtPayload, histIds: string[]): Promise<void> {
        await this.histModel.updateOne(
            { _id: { $in: histIds }, owner: user.sub },
            {
                visible: false,
            },
        );
    }
}
