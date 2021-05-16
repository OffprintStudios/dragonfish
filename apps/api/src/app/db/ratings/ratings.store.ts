import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RatingsDocument } from './ratings.schema';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { ContentStore } from '../content';

@Injectable()
export class RatingsStore {
    constructor(
        @InjectModel('Ratings') private readonly ratings: Model<RatingsDocument>,
        private readonly contentStore: ContentStore,
    ) {}

    public async addOrFetchRatingsDoc(user: JwtPayload, contentId: string) {
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

    public async addLike(user: JwtPayload, contentId: string) {
        const doc = await this.ratings.findOne({ contentId: contentId, userId: user.sub });
        doc.rating = RatingOption.Liked;

        const savedDoc = await doc.save();
        await this.updateCounts(contentId);
        return savedDoc;
    }

    public async addDislike(user: JwtPayload, contentId: string) {
        const doc = await this.ratings.findOne({ contentId: contentId, userId: user.sub });
        doc.rating = RatingOption.Disliked;

        const savedDoc = await doc.save();
        await this.updateCounts(contentId);
        return savedDoc;
    }

    public async setNoVote(user: JwtPayload, contentId: string) {
        const doc = await this.ratings.findOne({ contentId: contentId, userId: user.sub });
        doc.rating = RatingOption.NoVote;

        const savedDoc = await doc.save();
        await this.updateCounts(contentId);
        return savedDoc;
    }

    private async updateCounts(contentId: string) {
        const newLikedCount = await this.ratings
            .countDocuments({ contentId: contentId, rating: RatingOption.Liked });
        const newDislikedCount = await this.ratings
            .countDocuments({ contentId: contentId, rating: RatingOption.Disliked });
        console.log(`New Liked Count: ${newLikedCount}\nNew Disliked Count: ${newDislikedCount}`);
        await this.contentStore.updateRatingCounts(contentId, newLikedCount, newDislikedCount);
    }
}
