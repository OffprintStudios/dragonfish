import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RatingsDocument, ContentDocument } from '../schemas';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { PubStatus } from '@dragonfish/shared/models/content';

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
     * @param user
     * @param contentId
     */
    public async addOrFetchRatingsDoc(user: JwtPayload, contentId: string): Promise<RatingsDocument> {
        const existingDoc = await this.ratings.findOne({ contentId: contentId, userId: user.sub });

        if (isNullOrUndefined(existingDoc)) {
            const newDoc = new this.ratings({
                contentId: contentId,
                userId: user.sub,
            });

            return newDoc.save();
        } else {
            return existingDoc;
        }
    }

    /**
     * Switches a user's rating option to Liked.
     * @param user
     * @param contentId
     */
    public async addLike(user: JwtPayload, contentId: string): Promise<RatingsDocument> {
        const doc = await this.ratings.findOne({ contentId: contentId, userId: user.sub });
        doc.rating = RatingOption.Liked;

        const savedDoc = await doc.save();
        await this.updateCounts(contentId);
        return savedDoc;
    }

    /**
     * Switches a user's rating option to Disliked.
     * @param user
     * @param contentId
     */
    public async addDislike(user: JwtPayload, contentId: string): Promise<RatingsDocument> {
        const doc = await this.ratings.findOne({ contentId: contentId, userId: user.sub });
        doc.rating = RatingOption.Disliked;

        const savedDoc = await doc.save();
        await this.updateCounts(contentId);
        return savedDoc;
    }

    /**
     * Switches a user's rating option to NoVote.
     * @param user
     * @param contentId
     */
    public async setNoVote(user: JwtPayload, contentId: string): Promise<RatingsDocument> {
        const doc = await this.ratings.findOne({ contentId: contentId, userId: user.sub });
        doc.rating = RatingOption.NoVote;

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
                'stats.likes':
                    await this.ratings.countDocuments({ contentId: contentId, rating: RatingOption.Liked }),
                'stats.dislikes':
                    await this.ratings.countDocuments({ contentId: contentId, rating: RatingOption.Disliked }),
            })
            .where({ 'audit.isDeleted': false, 'audit.published': PubStatus.Published });
    }
}
