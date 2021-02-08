import { Injectable, Logger } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { ICollections } from '../../shared/content';
import { JwtPayload } from '@dragonfish/models/auth';
import { Collection, CollectionForm } from '@dragonfish/models/collections';
import { CollectionsStore } from '../../db/collections/collections.store';

@Injectable()
export class CollectionsService implements ICollections {
    private readonly logger: Logger = new Logger();

    constructor (private readonly collections: CollectionsStore) {}

    async getCollection(user: JwtPayload, collectionId: string): Promise<Collection> {
        return await this.collections.getOneCollection(user, collectionId);
    }

    async getAllCollections(user: JwtPayload, pageNum: number): Promise<PaginateResult<Collection>> {
        return await this.collections.getAllCollections(user, pageNum);
    }

    async getPublicCollection(userId: string, collectionId: string): Promise<Collection> {
        return await this.collections.getOnePublicCollection(userId, collectionId);
    }

    async getAllPublicCollections(userId: string, pageNum: number): Promise<PaginateResult<Collection>> {
        return await this.collections.getPublicCollections(userId, pageNum);
    }

    async getUserCollectionsNoPaginate(user: JwtPayload): Promise<Collection[]> {
        return await this.collections.getUserCollectionsNoPaginate(user);
    }

    async create(user: JwtPayload, collectionInfo: CollectionForm): Promise<Collection> {
        return await this.collections.createCollection(user.sub, collectionInfo);
    }

    async edit(user: JwtPayload, collectionId: string, collectionInfo: CollectionForm): Promise<Collection> {
        return await this.collections.editCollection(user, collectionId, collectionInfo);
    }

    async delete(user: JwtPayload, collectionId: string): Promise<void> {
        return await this.collections.deleteCollection(user, collectionId);
    }

    async addTo(user: JwtPayload, collectionId: string, contentId: string): Promise<Collection> {
        return await this.collections.addToCollection(user, collectionId, contentId);
    }

    async removeFrom(user: JwtPayload, collectionId: string, contentId: string): Promise<Collection> {
        return await this.collections.removeFromCollection(user, collectionId, contentId);
    }

    async setPublic(user: JwtPayload, collectionId: string): Promise<void> {
        return await this.collections.setPublic(user, collectionId);
    }

    async setPrivate(user: JwtPayload, collectionId: string): Promise<void> {
        return await this.collections.setPrivate(user, collectionId);
    }
}