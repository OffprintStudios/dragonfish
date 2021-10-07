import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, PaginateOptions, Model } from 'mongoose';
import { ContentDocument, RatingsDocument, ReadingHistoryDocument, SectionsDocument } from '../schemas';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { ContentFilter, ContentKind, ContentRating, PubStatus, WorkKind } from '@dragonfish/shared/models/content';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

/**
 * ## Content Group Store
 *
 * Functions that find and filter published content.
 */
@Injectable()
export class ContentGroupStore {
    readonly NEWEST_FIRST = -1
    constructor(
        @InjectModel('Content') private readonly content: PaginateModel<ContentDocument>,
        @InjectModel('Sections') private readonly sections: Model<SectionsDocument>,
        @InjectModel('Ratings') private readonly ratings: Model<RatingsDocument>,
        @InjectModel('ReadingHistory') private readonly history: Model<ReadingHistoryDocument>,
    ) {}

    //#region ---FETCHING---

    /**
     * Fetches the first six new works.
     * @param filter
     */
    public async fetchFirstNew(filter: ContentFilter) {
        const query = {
            kind: {
                $in: [ContentKind.PoetryContent, ContentKind.ProseContent],
            },
            'audit.isDeleted': false,
            'audit.published': PubStatus.Published,
        };
        const filteredQuery = await ContentGroupStore.determineContentFilter(query, filter);
        return this.content.find(filteredQuery).sort({ 'audit.publishedOn': this.NEWEST_FIRST }).limit(6);
    }

    public async fetchFirstUpdated() {
        // TODO: Implement this
    }

    public async fetchFirstRecommended() {
        // TODO: Implement this
    }

    /**
     * Fetches news content for the home page.
     */
    async fetchForHome(): Promise<ContentDocument[]> {
        const query = {
            kind: ContentKind.NewsContent,
            'audit.isDeleted': false,
            'audit.published': PubStatus.Published,
        };
        return this.content.find(query).sort({ 'audit.publishedOn': this.NEWEST_FIRST }).limit(6);
    }

    /**
     * Fetches all published documents based on kind, limited by page number.
     * @param pageNum The current page
     * @param kinds The kind of document to fetch
     * @param filter The currently active filter
     * @param userId (Optional) Fetch all published from one author
     */
    public async fetchAllNew(
        pageNum: number,
        kinds: ContentKind[],
        filter: ContentFilter,
        userId?: string,
    ): Promise<PaginateResult<ContentDocument>> {
        const query = { kind: { $in: kinds }, 'audit.isDeleted': false, 'audit.published': PubStatus.Published };
        const filteredQuery = await ContentGroupStore.determineContentFilter(query, filter);
        const paginateOptions = { sort: { 'audit.publishedOn': this.NEWEST_FIRST }, page: pageNum, limit: 15 };

        if (userId) {
            filteredQuery['author'] = userId;
        }

        return await this.content.paginate(filteredQuery, paginateOptions);
    }

    /**
     * Fetches one published item from the content collection via ID and ContentKind.
     * @param contentId A content's ID
     * @param kind A content's Kind
     * @param user (Optional) The user making the request
     */
    async fetchOnePublished(
        contentId: string,
        kind: ContentKind,
        user?: JwtPayload,
    ): Promise<[ContentDocument, RatingsDocument]> {
        const doc = await this.content.findOne({
            _id: contentId,
            kind: kind,
            'audit.isDeleted': false,
            'audit.published': PubStatus.Published,
        });
        if (isNullOrUndefined(user)) {
            await this.incrementViewCount(contentId);
            return [doc, null];
        } else {
            const authorInfo = doc.author as Pseudonym;
            if (authorInfo._id !== user.sub) {
                await this.incrementViewCount(contentId);
            }
            const ratings = await this.addOrFetchRatingsDoc(user, contentId);
            await this.addOrUpdateHistory(user, contentId);
            return [doc, ratings];
        }
    }

    /**
     * Fetches the first three published content specified in the `kinds` array, filtered as appropriate.
     * @param filter
     * @param userId
     */
    async fetchFirstThreePublished(
        filter: ContentFilter,
        userId: string,
    ): Promise<{ works: ContentDocument[]; blogs: ContentDocument[] }> {
        const worksQuery = {
            author: userId,
            kind: { $in: [ContentKind.ProseContent, ContentKind.PoetryContent] },
            'audit.isDeleted': false,
            'audit.published': PubStatus.Published,
        };
        const filteredWorksQuery = await ContentGroupStore.determineContentFilter(worksQuery, filter);
        const works = await this.content.find(filteredWorksQuery).sort({ 'audit.publishedOn': this.NEWEST_FIRST }).limit(3);

        const blogsQuery = {
            author: userId,
            kind: { $in: [ContentKind.BlogContent] },
            'audit.isDeleted': false,
            'audit.published': PubStatus.Published,
        };
        const filteredBlogsQuery = await ContentGroupStore.determineContentFilter(blogsQuery, filter);
        const blogs = await this.content.find(filteredBlogsQuery).sort({ 'audit.publishedOn': this.NEWEST_FIRST }).limit(3);

        return { works: works, blogs: blogs };
    }

    /**
     * Fetches all published documents based on kind, limited by page number.
     *
     * @param pageNum The current page
     * @param kinds The kind of document to fetch
     * @param filter
     * @param userId (Optional)
     */
    async fetchAllPublished(
        pageNum: number,
        kinds: ContentKind[],
        filter: ContentFilter,
        userId?: string,
    ): Promise<PaginateResult<ContentDocument>> {
        const query = { kind: { $in: kinds }, 'audit.isDeleted': false, 'audit.published': PubStatus.Published };
        const filteredQuery = await ContentGroupStore.determineContentFilter(query, filter);
        const paginateOptions = { sort: { 'audit.publishedOn': this.NEWEST_FIRST }, page: pageNum, limit: 15 };

        if (userId) {
            filteredQuery['author'] = userId;
        }

        return await this.content.paginate(filteredQuery, paginateOptions);
    }

    //#endregion

    //#region ---SEARCH---

    /**
     * Finds content related to the user's query.
     * @param query The string the user searched for.
     * @param kinds The kind of document to fetch.
     * @param authorId (Optional) ID of author of work that searching for.
     * @param pageNum The page of results to retrieve.
     * @param maxPerPage The maximum number of results per page.
     * @param filter The content filter to apply to returned results.
     */
    public async findRelatedContent(
        query: string,
        kinds: ContentKind[],
        authorId: string,
        category: WorkKind,
        pageNum: number,
        maxPerPage: number,
        filter: ContentFilter,
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
        if (authorId) {
            paginateQuery['author'] = authorId;
        }
        if (category) {
            paginateQuery['meta.category'] = category;
        }
        await ContentGroupStore.determineContentFilter(paginateQuery, filter);
        return await this.content.paginate(paginateQuery, paginateOptions);
    }

    /**
     * Finds content tagged with the given fandom tag.
     * @param tagId Tag that searching for in content.
     * @param kinds The kind of document to fetch.
     * @param pageNum The page of results to retrieve.
     * @param maxPerPage The maximum number of results per page.
     * @param filter The content filter to apply to returned results.
     * @returns 
     */
    public async getContentByFandomTag(
        tagId: string,
        kinds: ContentKind[],
        pageNum: number,
        maxPerPage: number,
        filter: ContentFilter,
    ): Promise<PaginateResult<ContentDocument>> {
        const paginateOptions: PaginateOptions = {
            sort: { 'audit.publishedOn': this.NEWEST_FIRST },
            page: pageNum,
            limit: maxPerPage,
        };
        const paginateQuery = {
            'audit.published': PubStatus.Published,
            'audit.isDeleted': false,
            kind: { $in: kinds },
            tags: tagId,
        };
        await ContentGroupStore.determineContentFilter(paginateQuery, filter);
        return await this.content.paginate(paginateQuery, paginateOptions);
    }

    //#endregion

    //#region ---PRIVATE---

    /**
     * Increments a content's view count.
     * @param contentId
     * @private
     */
    private async incrementViewCount(contentId: string) {
        return this.content.updateOne(
            { _id: contentId },
            {
                $inc: { 'stats.views': 1 },
            },
        );
    }

    /**
     * Fetches a user's ratings doc. If one doesn't exist, add one and return the result.
     * @param user
     * @param contentId
     */
    private async addOrFetchRatingsDoc(user: JwtPayload, contentId: string): Promise<RatingsDocument> {
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
     * Updates an existing history doc. If none are found, adds a new one.
     * @param user
     * @param contentId
     * @private
     */
    private async addOrUpdateHistory(user: JwtPayload, contentId: string): Promise<void> {
        const existingDoc = await this.history.findOne({ owner: user.sub, content: contentId });

        if (isNullOrUndefined(existingDoc)) {
            const newHist = new this.history({
                owner: user.sub,
                content: contentId,
                viewedOn: new Date(),
                ratingOption: RatingOption.NoVote,
            });

            await newHist.save();
        } else {
            await this.history.findOneAndUpdate(
                { owner: user.sub, content: contentId },
                {
                    viewedOn: new Date(),
                    visible: true,
                },
            );
        }
    }

    /**
     * Determines which settings to apply on the content filter by checking a user's filter settings.
     * @param query The query to add to
     * @param filter The current filter settings
     * @private
     */
    private static async determineContentFilter(query, filter: ContentFilter) {
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

    //#endregion
}
