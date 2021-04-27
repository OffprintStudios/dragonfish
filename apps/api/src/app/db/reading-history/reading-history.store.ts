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
            return await this.histModel.findOneAndUpdate(
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
    async fetchUserHistory(user: JwtPayload, pageNum: number): Promise<PaginateResult<ReadingHistoryDocument>> {
        return await this.histModel.paginate(
            { owner: user.sub, visible: true },
            {
                sort: { viewedOn: -1 },
                page: pageNum,
                limit: 15,
            }
        );
    }

    /**
     * Fetches seven history documents belonging to one user for their sidenav.
     *
     * @param user The owner of these documents
     */
    async fetchUserSidenavHistory(user: JwtPayload): Promise<ReadingHistoryDocument[]> {
        return await this.histModel.find({ owner: user.sub, visible: true }).limit(7).sort({ viewedOn: -1 });
    }

    /**
     * Fetches one history document associated with both a user and some content.
     *
     * @param user The owner of the history document
     * @param contentId The content associated with it
     */
    async fetchOneHistoryDoc(user: JwtPayload, contentId: string): Promise<ReadingHistoryDocument> {
        return await this.histModel.findOne({ owner: user.sub, content: contentId }, { autopopulate: false });
    }

    /**
     * Sets the rating option of a history document to Liked.
     *
     * @param user The owner of the history document
     * @param contentId The content associated with it
     */
    async setLike(user: JwtPayload, contentId: string): Promise<ReadingHistoryDocument> {
        return await this.histModel.findOneAndUpdate(
            { owner: user.sub, content: contentId },
            {
                ratingOption: RatingOption.Liked,
            },
            { new: true }
        );
    }

    /**
     * Sets the rating option of a history document to Disliked.
     *
     * @param user The owner of the history document
     * @param contentId The content associated with it
     */
    async setDislike(user: JwtPayload, contentId: string): Promise<ReadingHistoryDocument> {
        return await this.histModel.findOneAndUpdate(
            { owner: user.sub, content: contentId },
            {
                ratingOption: RatingOption.Disliked,
            },
            { new: true }
        );
    }

    /**
     * Sets the rating option of a history document to NoVote.
     *
     * @param user The owner of the history document
     * @param contentId The content associated with it
     */
    async setNoVote(user: JwtPayload, contentId: string): Promise<ReadingHistoryDocument> {
        return await this.histModel.findOneAndUpdate(
            { owner: user.sub, content: contentId },
            {
                ratingOption: RatingOption.NoVote,
            },
            { new: true }
        );
    }

    /**
     * Soft deletes a history document so it no longer shows up on frontend queries.
     *
     * @param user The owner of the history document
     * @param histId The history document itself
     */
    async changeVisibility(user: JwtPayload, histId: string): Promise<void> {
        await this.histModel.updateOne(
            { _id: histId, owner: user.sub },
            {
                visible: false,
            }
        );
    }
}
