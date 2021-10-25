import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, PaginateOptions, Model } from 'mongoose';
import {
    BlogsContentDocument,
    ContentDocument,
    RatingsDocument,
    ReadingHistoryDocument,
    SectionsDocument,
    TagsDocument,
} from '../schemas';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import {
    ContentFilter,
    ContentKind,
    ContentRating,
    Genres,
    PubStatus,
    WorkKind,
} from '@dragonfish/shared/models/content';
import { Pseudonym } from '@dragonfish/shared/models/accounts';
import { SearchMatch } from '@dragonfish/shared/models/search';

/**
 * ## Content Group Store
 *
 * Functions that find and filter published content.
 */
@Injectable()
export class ContentGroupStore {
    readonly NEWEST_FIRST = -1;
    constructor(
        @InjectModel('Content') private readonly content: PaginateModel<ContentDocument>,
        @InjectModel('BlogContent') private readonly blogsModel: PaginateModel<BlogsContentDocument>,
        @InjectModel('Sections') private readonly sections: Model<SectionsDocument>,
        @InjectModel('Ratings') private readonly ratings: Model<RatingsDocument>,
        @InjectModel('ReadingHistory') private readonly history: Model<ReadingHistoryDocument>,
        @InjectModel('Tags') private readonly tags: Model<TagsDocument>,
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
    async fetchForHome(): Promise<BlogsContentDocument[]> {
        const query = {
            'audit.isDeleted': false,
            'audit.isNewsPost': true,
            'audit.published': PubStatus.Published,
        };
        return this.blogsModel.find(query).sort({ 'audit.publishedOn': this.NEWEST_FIRST }).limit(6);
    }

    /**
     * Fetches the whole news feed.
     *
     * @param page
     */
    async fetchNewsFeed(page: number): Promise<PaginateResult<BlogsContentDocument>> {
        const query = {
            'audit.isDeleted': false,
            'audit.isNewsPost': true,
            'audit.published': PubStatus.Published,
        };
        const paginateOptions = { sort: { 'audit.publishedOn': this.NEWEST_FIRST }, page: page, limit: 15 };
        return this.blogsModel.paginate(query, paginateOptions);
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
        const works = await this.content
            .find(filteredWorksQuery)
            .sort({ 'audit.publishedOn': this.NEWEST_FIRST })
            .limit(3);

        const blogsQuery = {
            author: userId,
            kind: { $in: [ContentKind.BlogContent] },
            'audit.isDeleted': false,
            'audit.published': PubStatus.Published,
        };
        const filteredBlogsQuery = await ContentGroupStore.determineContentFilter(blogsQuery, filter);
        const blogs = await this.content
            .find(filteredBlogsQuery)
            .sort({ 'audit.publishedOn': this.NEWEST_FIRST })
            .limit(3);

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
     * @param category (Optional) The category of content that searching for.
     * @param genreSearchMatch When searching genre, how the genres should match.
     * @param genres (Optional) The genres of content that searching for.
     * @param tagSearchMatch When searching tags, how the tags should match
     * @param tagIds (Optional) The fandom tags that searching for in content
     * @param pageNum The page of results to retrieve.
     * @param maxPerPage The maximum number of results per page.
     * @param filter The content filter to apply to returned results.
     */
    public async findRelatedContent(
        query: string | null,
        kinds: ContentKind[],
        authorId: string | null,
        category: WorkKind | null,
        genreSearchMatch: SearchMatch,
        genres: Genres[] | null,
        tagSearchMatch: SearchMatch,
        tagIds: string[] | null,
        includeChildTags: boolean,
        pageNum: number,
        maxPerPage: number,
        filter: ContentFilter,
    ): Promise<PaginateResult<ContentDocument>> {
        const paginateOptions: PaginateOptions = {
            sort: { 'audit.publishedOn': this.NEWEST_FIRST },
            page: pageNum,
            limit: maxPerPage,
            options: {
                strictQuery: false,
            },
        };
        const paginateQuery = {
            'audit.published': PubStatus.Published,
            'audit.isDeleted': false,
            kind: { $in: kinds },
        };
        if (query) {
            paginateQuery['$text'] = { $search: query };
        }
        if (authorId) {
            paginateQuery['author'] = authorId;
        }
        if (category) {
            paginateQuery['meta.category'] = category;
        }
        if (genres && genres.length > 0) {
            switch(genreSearchMatch) {
                case SearchMatch.All:
                    paginateQuery['meta.genres'] = { $all: genres };
                    break;
                case SearchMatch.OneOrMore:
                    paginateQuery['meta.genres'] = { $in: genres };
                    break;
                case SearchMatch.NoOthers:
                    paginateQuery['meta.genres'] = { $not: { $elemMatch: { $nin: genres }}, $exists: true };
                    paginateQuery['meta.genres.0'] = { $exists: true };
                    break;
                case SearchMatch.Exactly:
                    paginateQuery['meta.genres'] = genres;
                    break;
                default:
                    paginateQuery['meta.genres'] = { $all: genres };
                    break;
            }
        }
        if (tagIds && tagIds.length > 0) {
            switch(tagSearchMatch) {
                case SearchMatch.All:
                    if (includeChildTags) {
                        const tagConditions = [];
                        for (const tag of tagIds) {
                            const tagArray = await this.getAllTagIds(tag);
                            tagConditions.push( { tags: { $in: tagArray } });
                        }
                        paginateQuery['$and'] = tagConditions;
                    } else {
                        paginateQuery['tags'] = { $all: tagIds };
                    }
                    break;
                case SearchMatch.OneOrMore:
                    if (includeChildTags) {
                        const allTags: string[] = [];
                        for (const tag of tagIds) {
                            const tagArray = await this.getAllTagIds(tag);
                            allTags.push(...tagArray);
                        }
                        paginateQuery['tags'] = { $in: allTags };
                    } else {
                        paginateQuery['tags'] = { $in: tagIds };
                    }
                    break;
                case SearchMatch.NoOthers:
                    if (includeChildTags) {
                        const allTags: string[] = [];
                        for (const tag of tagIds) {
                            const tagArray = await this.getAllTagIds(tag);
                            allTags.push(...tagArray);
                        }
                        paginateQuery['tags'] = { $not: { $elemMatch: { $nin: allTags }}, $exists: true };
                        paginateQuery['tags.0'] = { $exists: true };
                    } else {
                        paginateQuery['tags'] = { $not: { $elemMatch: { $nin: tagIds }}, $exists: true };
                        paginateQuery['tags.0'] = { $exists: true };
                    }
                    break;
                case SearchMatch.Exactly:
                    paginateQuery['tags'] = tagIds;
                    break;
                default:
                    paginateQuery['tags'] = { $all: tagIds };
                    break;
            }
        }
        await ContentGroupStore.determineContentFilter(paginateQuery, filter);
        return await this.content.paginate(paginateQuery, paginateOptions);
    }

    /**
     * Increments a content's view count.
     * @param contentId
     * @private
     */
    public async incrementViewCount(contentId: string) {
        return this.content.updateOne(
            { _id: contentId },
            {
                $inc: { 'stats.views': 1 },
            },
        );
    }

    //#endregion

    //#region ---PRIVATE---

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

    /**
     * Given a tagId, constructs an array of that tagId and the IDs of that tag's children
     * @param tagId ID of tag that searching for children for
     * @returns string[] of the given tagId and the IDs of that tag's children (just tagId if it has no children)
     */
    private async getAllTagIds(tagId: string) {
        const childTags = await this.tags.find({ parent: tagId });
        if (childTags) {
            const childTagIds = childTags.map((tag) => tag._id);
            childTagIds.push(tagId);
            return childTagIds;
        }
        return [tagId];
    }

    //#endregion
}
