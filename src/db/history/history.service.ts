import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as documents from './models';
import { UserDocument } from '../users/models';

@Injectable()
export class HistoryService {
    constructor(@InjectModel('History') private readonly histModel: Model<documents.HistoryDocument>,
        @InjectModel('HistoryItem') private readonly histItemModel: Model<documents.HistoryItemDocument>) {}

    /**
     * Creates a new history document on a per-user basis.
     * 
     * @param user The owner of this new history document
     */
    async createHistoryDocument(user: UserDocument) {
        const newHist = new this.histModel({
            'owner': user._id
        });

        return await newHist.save();
    }
}
