import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { PaginateModel, PaginateResult } from 'mongoose';
import { isNullOrUndefined } from '../../util';
import { ReadingHistoryDocument } from './reading-history.schema';
import { RatingOption } from '@dragonfish/shared/models/reading-history';

@Injectable()
export class ReadingHistoryStore {
    constructor(@InjectModel('ReadingHistory') private readonly histModel: PaginateModel<ReadingHistoryDocument>) {}

    /**
     * Creates a new history document if, and only if, one for the existing content doesn't
     * already exist for this user. Otherwise, updates the existing document with a new
     * `viewedOn` date and resets its visibility to `true`.
     *
     * @param user The owner of this history document
     * @param contentId The content being viewed
     */
    async addOrUpdateHistory(user: JwtPayload, contentId: string): Promise<ReadingHistoryDocument> {
        const existingDoc = await this.histModel.findOne({ owner: user.sub, content: contentId });

        if (isNullOrUndefined(existingDoc)) {
            const newHist = new this.histModel({
                owner: user.sub,
                content: contentId,
                viewedOn: new Date(),
                ratingOption: RatingOption.NoVote,
            });

            return await newHist.save();
        } else {
            return this.histModel.findOneAndUpdate(
                { owner: user.sub, content: contentId },
                {
                    viewedOn: new Date(),
                    visible: true,
                }
            );
        }
    }

    /**
     * Fetches all history documents belonging to one user.
     *
     * @param user The owner of these documents
     * @param pageNum The current page of results to view
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
        return this.histModel.findOne({ owner: user.sub, content: contentId }, { autopopulate: false });
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
            }
        );
    }
}
