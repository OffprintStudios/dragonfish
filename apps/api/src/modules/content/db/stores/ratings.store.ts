import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RatingsDocument, ContentDocument } from '../schemas';
import { JwtPayload } from '$shared/auth';
import { RatingOption } from '$shared/models/ratings';
import { PubStatus } from '$shared/models/content';

/**
 * ## Ratings Store
 *
 * Functions that deal with creating, fetching, and updating ratings documents.
 */
@Injectable()
export class RatingsStore {
    constructor(
        @InjectModel('Content') private readonly content: Model<ContentDocument>,
        @InjectModel('Ratings') private readonly ratings: Model<RatingsDocument>,
    ) {}

    /**
     * Fetches a user's ratings doc. If one doesn't exist, add one and return the result.
     * @param accountId
     * @param contentId
     */
    public async addOrFetchRatingsDoc(
        accountId: string,
        contentId: string,
    ): Promise<RatingsDocument> {
        const existingDoc = await this.ratings.findOne({ contentId: contentId, userId: accountId });

        if (existingDoc === null || existingDoc === undefined) {
            const newDoc = new this.ratings({
                contentId: contentId,
                userId: accountId,
            });

            return newDoc.save();
        } else {
            return existingDoc;
        }
    }

    /**
     * Changes a user's vote.
     * @param user
     * @param contentId
     * @param newVote
     */
    public async changeVote(
        user: JwtPayload,
        contentId: string,
        newVote: RatingOption,
    ): Promise<RatingsDocument> {
        const doc = await this.ratings.findOne({ contentId: contentId, userId: user.sub });
        doc.rating = newVote;

        const savedDoc = await doc.save();
        await this.updateCounts(contentId);
        return savedDoc;
    }

    /**
     * Updates the like and dislike counts of a document in the Content collection.
     * @param contentId
     * @private
     */
    private async updateCounts(contentId: string): Promise<void> {
        await this.content
            .findByIdAndUpdate(contentId, {
                'stats.likes': await this.ratings.countDocuments({
                    contentId: contentId,
                    rating: RatingOption.Liked,
                }),
                'stats.dislikes': await this.ratings.countDocuments({
                    contentId: contentId,
                    rating: RatingOption.Disliked,
                }),
            })
            .where({ 'audit.isDeleted': false, 'audit.published': PubStatus.Published });
    }
}
