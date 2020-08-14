import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sanitize from 'sanitize-html';

import * as documents from './models';
import { JwtPayload } from 'shared/models/auth';
import { CreateCollection, EditCollection } from 'shared/models/collections';

@Injectable()
export class CollectionsService {
    constructor(@InjectModel('Collection') private readonly collectionModel: Model<documents.CollectionDocument>) {}

    /**
     * Creates a collection and saves it to the database.
     * 
     * @param user The owner of the collection
     * @param collInfo The collection's information
     */
    async createCollection(user: JwtPayload, collInfo: CreateCollection): Promise<documents.CollectionDocument> {
        const newCollection = new this.collectionModel({
            'user': user.sub,
            'name': sanitize(collInfo.name),
            'desc': sanitize(collInfo.desc),
            'audit.isPublic': collInfo.public,
        });

        return await newCollection.save();
    }

    /**
     * Gets all undeleted collections belonging to a single user.
     * 
     * @param user The owner of these collections
     */
    async getUserCollections(user: JwtPayload): Promise<documents.CollectionDocument[]> {
        return await this.collectionModel.find()
            .where('user').equals(user.sub)
            .where('audit.isDeleted').equals(false);
    }

    /**
     * Fetches all public collections that a user has.
     * 
     * @param userId The owner of the portfolio
     */
    async getPortfolioCollections(userId: string): Promise<documents.CollectionDocument[]> {
        return await this.collectionModel.find()
            .where('user').equals(userId)
            .where('audit.isPublic').equals(true)
            .where('audit.isDeleted').equals(false);
    }

    /**
     * Edits a collection given the newest collection info.
     * 
     * @param user The owner of the collection
     * @param collId The collection ID
     * @param collInfo The new collection info
     */
    async editCollection(user: JwtPayload, collId: string, collInfo: EditCollection): Promise<void> {
        return await this.collectionModel.updateOne({'_id': collId}, {
            'name': sanitize(collInfo.name),
            'desc': sanitize(collInfo.desc),
            'audit.isPublic': collInfo.public,
        })
        .where('user').equals(user.sub)
        .where('audit.isDeleted').equals(false);
    }

    /**
     * Soft deletes a collection associated with the provided user.
     * 
     * @param user The owner of the collection
     * @param collId The collection to delete
     */
    async deleteCollection(user: JwtPayload, collId: string): Promise<void> {
        return await this.collectionModel.updateOne({'_id': collId}, {'audit.isDeleted': false})
            .where('user').equals(user.sub);
    }
}
