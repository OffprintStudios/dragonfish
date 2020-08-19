import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generate } from 'shortid';

import * as documents from './models';
import { RatingOption } from 'shared/models/history';
import { isNullOrUndefined } from 'src/util';

@Injectable()
export class HistoryService {
    constructor(@InjectModel('History') private readonly histModel: Model<documents.HistoryDocument>) {}

    /**
     * Creates a new history document on a per-user basis.
     * 
     * @param user The owner of this new history document
     */
    async addOrUpdateHistory(userId: string, workId: string): Promise<documents.HistoryDocument> {
        const existingDoc = await this.histModel.findOne({'owner': userId, 'work': workId});
        if (isNullOrUndefined(existingDoc)) {
            const newHist = new this.histModel({
                'owner': userId,
                'work': workId,
                'viewedOn': new Date(),
                'ratingOption': RatingOption.NoVote
            });

            return await newHist.save();
        } else {
            return await this.histModel.findOneAndUpdate({'owner': userId, 'work': workId}, {
                'viewedOn': new Date(),
                'visible': true
            });
        }
    }

    /**
     * Fetches all history documents belonging to one user.
     * 
     * @param userId The owner of these documents
     */
    async fetchUserHistory(userId: string): Promise<documents.HistoryDocument[]> {
        return await this.histModel.find({'owner': userId})
            .where('visible').equals(true)
            .sort({'viewedOn': -1});
    }

    /**
     * Fetches one history document associated with both a user and a work.
     * 
     * @param userId The owner of the history document
     * @param workId The work associated with it
     */
    async fetchOneHistoryDoc(userId: string, workId: string): Promise<documents.HistoryDocument> {
        return await this.histModel.findOne({'owner': userId, 'work': workId});
    }

    /**
     * Sets the rating option of a history document to Liked.
     * 
     * @param userId The owner of the history document
     * @param workId The work associated with it
     */
    async setLike(userId: string, workId: string): Promise<void> {
        return await this.histModel.updateOne({'owner': userId, 'work': workId}, {
            'ratingOption': RatingOption.Liked
        });
    }

    /**
     * Sets the rating option of a history document to Disliked.
     * 
     * @param userId The owner of the history document
     * @param workId The work associated with it
     */
    async setDislike(userId: string, workId: string): Promise<void> {
        return await this.histModel.updateOne({'owner': userId, 'work': workId}, {
            'ratingOption': RatingOption.Disliked
        });
    }

    /**
     * Sets the rating option of a history document to NoVote.
     * 
     * @param userId The owner of the history document
     * @param workId The work associated with it
     */
    async setNoVote(userId: string, workId: string): Promise<void> {
        return await this.histModel.updateOne({'owner': userId, 'work': workId}, {
            'ratingOption': RatingOption.NoVote
        });
    }

    /**
     * Soft deletes a history document so it no longer shows up on frontend queries.
     * 
     * @param userId The owner of the history document
     * @param histId The history document itself
     */
    async changeVisibility(userId: string, histId: string): Promise<void> {
        return await this.histModel.updateOne({'_id': histId, 'owner': userId}, {
            'visible': false
        });
    }
}
