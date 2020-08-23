import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import * as sanitize from 'sanitize-html';

import * as documents from './models';
import { JwtPayload } from '@pulp-fiction/models/auth';
import { CreateCollection, EditCollection } from '@pulp-fiction/models/collections';

@Injectable()
export class CollectionsService {
    constructor(@InjectModel('Collection') private readonly collectionModel: PaginateModel<documents.CollectionDocument>) {}

    /**
     * Creates a collection and saves it to the database.
     * 
     * @param user The owner of the collection
     * @param collInfo The collection's information
     */
    async createCollection(userId: string, collInfo: CreateCollection): Promise<documents.CollectionDocument> {
        const newCollection = new this.collectionModel({
            'user': userId,
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
    async getUserCollections(user: JwtPayload, pageNum: number): Promise<PaginateResult<documents.CollectionDocument>> {
        return await this.collectionModel.paginate({'user': user.sub, 'audit.isDeleted': false}, {
            sort: {'createdAt': -1},
            page: pageNum,
            limit: 15
        });
    }

    /**
     * Gets all undeleted collections belonging to a single user.
     * 
     * @param user The owner of these collections
     */
    async getUserCollectionsNoPaginate(user: JwtPayload): Promise<documents.CollectionDocument[]>{
        return await this.collectionModel.find({'user': user.sub, 'audit.isDeleted': false});
    }

    /**
     * Fetches all public collections that a user has.
     * 
     * @param userId The owner of the portfolio
     */
    async getPortfolioCollections(userId: string, pageNum: number): Promise<PaginateResult<documents.CollectionDocument>> {
        return await this.collectionModel.paginate({'user': userId, 'audit.isPublic': true, 'audit.isDeleted': false}, {
            sort: {'createdAt': -1},
            page: pageNum,
            limit: 15
        });
    }

    /**
     * Grabs a single collection from the database belonging to the specified user.
     * 
     * @param userId The owner of the portfolio
     * @param collId The collection to fetch
     */
    async getOnePortCollection(userId: string, collId: string): Promise<documents.CollectionDocument> {
        return await this.collectionModel.findOne({'_id': collId})
            .where('user').equals(userId)
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
     * Adds a work to the collection.
     * 
     * @param user The owner of the collection
     * @param collId The collection ID
     * @param workId The work to add
     */
    async addWorkToCollection(user: JwtPayload, collId: string, workId: string): Promise<void> {
        return await this.collectionModel.updateOne({'_id': collId, 'user': user.sub}, {$push: {'details': { 'work': workId, 'addedOn': new Date()}}});
    }

    /**
     * Removes a work from the collection.
     * 
     * @param user The owner of the collection
     * @param collId The collection ID
     * @param workId The work to remove
     */
    async removeWorkFromCollection(user: JwtPayload, collId: string, workId: string): Promise<void> {
        return await this.collectionModel.updateOne({'_id': collId, 'user': user.sub}, {
            $pull: {'details': { 'work': workId }}
        });
    }

    /**
     * Soft deletes a collection associated with the provided user.
     * 
     * @param user The owner of the collection
     * @param collId The collection to delete
     */
    async deleteCollection(user: JwtPayload, collId: string): Promise<void> {
        return await this.collectionModel.updateOne({'_id': collId}, {'audit.isDeleted': true})
            .where('user').equals(user.sub);
    }

    /**
     * Sets a collection's isPublic flag to true.
     * 
     * @param user The owner of the collection
     * @param collId The collection to make public
     */
    async setPublic(user: JwtPayload, collId: string): Promise<void> {
        return await this.collectionModel.updateOne({'_id': collId}, {'audit.isPublic': true})
            .where('user').equals(user.sub);
    }

    /**
     * Sets a collection's isPublic flag to false.
     * 
     * @param user The owner of the collection
     * @param collId The collection to make private
     */
    async setPrivate(user: JwtPayload, collId: string): Promise<void> {
        return await this.collectionModel.updateOne({'_id': collId}, {'audit.isPublic': false})
            .where('user').equals(user.sub);
    }
}
