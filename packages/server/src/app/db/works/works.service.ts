import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';

import * as models from '@dragonfish/models/works';
import * as documents from './models';

@Injectable()
export class WorksService {
    constructor(@InjectModel('Work') private readonly workModel: PaginateModel<documents.WorkDocument>) {}

    /**
     * Grabs all a user's works and returns them in an array. Used only
     * for a user's own works list.
     *
     * @param user The user whose works we're fetching.
     */
    async fetchUserWorks(user: any): Promise<documents.WorkDocument[]> {
        return await this.workModel
            .find({ author: user.sub, 'audit.isDeleted': false }, { autopopulate: false })
            .sort({ createdAt: -1 });
    }

    async findOneById(user: any, workId: string): Promise<documents.WorkDocument> {
        const thisWork = await this.workModel.findOne(
            { _id: workId, author: user.sub, 'audit.isDeleted': false },
            { autopopulate: false },
        );
        return thisWork;
    }

    /**
     * Finds the first six matches given the provided search parameters.
     * For use with the initial page of search results.
     *
     * @param query The relevant search parameters
     */
    async findInitialRelatedWorks(
        query: string,
        contentFilter: models.ContentFilter,
    ): Promise<documents.WorkDocument[]> {
        let findQuery = {
            $text: { $search: query },
            'audit.published': models.ApprovalStatus.Approved,
            'audit.isDeleted': false,
        };

        switch (contentFilter) {
            case models.ContentFilter.Everything:
                findQuery = findQuery;
                break;
            case models.ContentFilter.MatureEnabled:
                findQuery['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                    { 'meta.rating': models.ContentRating.Mature },
                ];
                break;
            case models.ContentFilter.ExplicitEnabled:
                findQuery['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                    { 'meta.rating': models.ContentRating.Explicit },
                ];
                break;
            default:
                findQuery['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                ];
                break;
        }

        return await this.workModel.find(findQuery).limit(6);
    }

    /**
     * Finds any related works related to a user's query.
     *
     * @param searchParameters The user's search query
     */
    async findRelatedWorks(
        query: string,
        pageNum: number,
        contentFilter: models.ContentFilter,
    ): Promise<PaginateResult<documents.WorkDocument>> {
        let paginateQuery = {
            $text: { $search: query },
            'audit.published': models.ApprovalStatus.Approved,
            'audit.isDeleted': false,
        };
        let paginateOptions = { page: pageNum, limit: 15 };

        switch (contentFilter) {
            case models.ContentFilter.Everything:
                paginateQuery = paginateQuery;
                break;
            case models.ContentFilter.MatureEnabled:
                paginateQuery['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                    { 'meta.rating': models.ContentRating.Mature },
                ];
                break;
            case models.ContentFilter.ExplicitEnabled:
                paginateQuery['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                    { 'meta.rating': models.ContentRating.Explicit },
                ];
                break;
            default:
                paginateQuery['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                ];
                break;
        }

        return await this.workModel.paginate(paginateQuery, paginateOptions);
    }

    /**
     * FOR MIGRATION PURPOSES ONLY: Completely removes a work from the database. To be
     * used only after migration of the work has occurred.
     *
     * @param user The author of the work
     * @param workId The work we're deleting
     */
    async deleteWork(user: any, workId: string): Promise<void> {
        await this.workModel.deleteOne({ _id: workId, author: user.sub });
    }

    /**
     * Fetches all new published works by newest first.
     */
    async fetchNewPublishedWorks(
        contentFilter: models.ContentFilter,
        pageNum: number,
    ): Promise<PaginateResult<documents.WorkDocument>> {
        let query = { 'audit.published': models.ApprovalStatus.Approved, 'audit.isDeleted': false };
        let paginateOptions = { sort: { 'audit.publishedOn': -1 }, page: pageNum, limit: 15 };

        switch (contentFilter) {
            case models.ContentFilter.Everything:
                query = query;
                break;
            case models.ContentFilter.MatureEnabled:
                query['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                    { 'meta.rating': models.ContentRating.Mature },
                ];
                break;
            case models.ContentFilter.ExplicitEnabled:
                query['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                    { 'meta.rating': models.ContentRating.Explicit },
                ];
                break;
            default:
                query['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                ];
                break;
        }

        return await this.workModel.paginate(query, paginateOptions);
    }

    /**
     * Grabs a list of all works by this user.
     *
     * @param userId The user whose works we're fetching
     */
    async getWorksList(
        userId: any,
        contentFilter: models.ContentFilter,
        pageNum: number,
    ): Promise<PaginateResult<documents.WorkDocument>> {
        let query = { author: userId, 'audit.published': models.ApprovalStatus.Approved, 'audit.isDeleted': false };
        let paginateOptions = { sort: { 'audit.publishedOn': -1 }, page: pageNum, limit: 15 };

        switch (contentFilter) {
            case models.ContentFilter.Everything:
                query = query;
                break;
            case models.ContentFilter.MatureEnabled:
                query['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                    { 'meta.rating': models.ContentRating.Mature },
                ];
                break;
            case models.ContentFilter.ExplicitEnabled:
                query['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                    { 'meta.rating': models.ContentRating.Explicit },
                ];
                break;
            default:
                query['$or'] = [
                    { 'meta.rating': models.ContentRating.Everyone },
                    { 'meta.rating': models.ContentRating.Teen },
                ];
                break;
        }

        return await this.workModel.paginate(query, paginateOptions);
    }

    /**
     * Gets an estimated count of _all_ non-deleted works, included upublished works.
     */
    async getTotalWorkCount(): Promise<number> {
        return await this.workModel
            .countDocuments()
            .where('audit.published', models.ApprovalStatus.Approved)
            .where('audit.isDeleted', false);
    }
}
