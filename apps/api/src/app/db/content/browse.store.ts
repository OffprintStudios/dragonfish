import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { ContentDocument } from './content.schema';
import { ContentFilter, ContentRating, ContentKind, PubStatus } from '@dragonfish/shared/models/content';

@Injectable()
export class BrowseStore {
    constructor(@InjectModel('Content') private readonly contentModel: PaginateModel<ContentDocument>) {}

    /**
     * Fetches the first six new works.
     *
     * @param filter
     */
    async fetchFirstNew(filter: ContentFilter) {
        const query = {
            kind: {
                $in: [ContentKind.PoetryContent, ContentKind.ProseContent]
            },
            'audit.isDeleted': false,
            'audit.published': PubStatus.Published
        };
        const filteredQuery = await this.determineContentFilter(query, filter);
        return this.contentModel.find(filteredQuery)
            .sort({'audit.publishedOn': -1})
            .limit(6);
    }

    async fetchFirstUpdated() {
        // TODO: Implement this
    }

    async fetchFirstRecommended() {
        // TODO: Implement this
    }

    /**
     * Fetches all published documents based on kind, limited by page number.
     *
     * @param pageNum The current page
     * @param kinds The kind of document to fetch
     * @param filter The currently active filter
     * @param userId (Optional) Fetch all published from one author
     */
    async fetchAllNew(
        pageNum: number,
        kinds: ContentKind[],
        filter: ContentFilter,
        userId?: string
    ): Promise<PaginateResult<ContentDocument>> {
        const query = { kind: { $in: kinds }, 'audit.isDeleted': false, 'audit.published': PubStatus.Published };
        const filteredQuery = await this.determineContentFilter(query, filter);
        const paginateOptions = { sort: { 'audit.publishedOn': -1 }, page: pageNum, limit: 15 };

        if (userId) {
            filteredQuery['author'] = userId;
        }

        return await this.contentModel.paginate(filteredQuery, paginateOptions);
    }

    /**
     * Finds content related to the the user's query.
     *
     * @param query The string the user searched for.
     * @param kinds The kind of document to fetch.
     * @param pageNum The page of results to retrieve.
     * @param maxPerPage The maximum number of results per page.
     * @param filter The content filter to apply to returned results.
     */
    async findRelatedContent(
        query: string,
        kinds: ContentKind[],
        pageNum: number,
        maxPerPage: number,
        filter: ContentFilter
    ): Promise<PaginateResult<ContentDocument>> {
        const paginateOptions: PaginateOptions = {
            page: pageNum,
            limit: maxPerPage,
        };
        const paginateQuery = {
            $text: { $search: query },
            'audit.published': PubStatus.Published,
            'audit.isDeleted': false,
            kind: { $in: kinds },
        };
        await this.determineContentFilter(paginateQuery, filter);
        return await this.contentModel.paginate(paginateQuery, paginateOptions);
    }

    /**
     * Determines which settings to apply on the content filter by checking a user's filter settings.
     *
     * @param query The query to add to
     * @param filter The current filter settings
     */
    async determineContentFilter(query: any, filter: ContentFilter) {
        switch (filter) {
            case ContentFilter.Everything:
                break;
            case ContentFilter.MatureEnabled:
                query['$or'] = [
                    { 'meta.rating': ContentRating.Everyone },
                    { 'meta.rating': ContentRating.Teen },
                    { 'meta.rating': ContentRating.Mature },
                ];
                break;
            case ContentFilter.ExplicitEnabled:
                query['$or'] = [
                    { 'meta.rating': ContentRating.Everyone },
                    { 'meta.rating': ContentRating.Teen },
                    { 'meta.rating': ContentRating.Explicit },
                ];
                break;
            default:
                query['$or'] = [{ 'meta.rating': ContentRating.Everyone }, { 'meta.rating': ContentRating.Teen }];
                break;
        }
        return query;
    }
}
