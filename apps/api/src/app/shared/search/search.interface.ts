import { PaginateResult } from 'mongoose';

import { ContentFilter, ContentModel } from '@dragonfish/shared/models/content';
import { InitialResults } from '@dragonfish/shared/models/util';
import { SearchKind } from '@dragonfish/shared/models/search';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

export interface ISearch {
    /**
     * Fetches the initial results for the search page.
     *
     * @param query The user's query
     * @param contentFilter Any available content filter
     */
    fetchInitialResults(query: string, contentFilter: ContentFilter): Promise<InitialResults>;

    /**
     * Fetches search results given query for the specified kids
     * 
     * @param query The user's query
     * @param searchKind The kind of content that searching for
     * @param author (Optional) The author of content that searching for
     * @param categoryKey (Optional) The category key of content that searching for
     * @param genreKeys (Optional) The genre keys of content that searching for.
     * @param genreSearchAny When searching genre, whether all genres should match or just one or more.
     * @param pageNum The current results page
     * @param contentFilter Any available content filter
     */
    findRelatedContent(
        query: string,
        searchKind: SearchKind,
        author: string | null,
        categoryKey: string | null,
        genreKeys: string[] | null,
        genreSearchAny: boolean,
        pageNum: number,
        contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>>;

    /**
     * Finds the current page of user results matching a user's query.
     *
     * @param query The user's query
     * @param pageNum The current results page
     */
    searchUsers(query: string, pageNum: number): Promise<PaginateResult<Pseudonym>>;

    /**
     * Finds the current page of blog results matching a user's query.
     *
     * @param query The user's query
     * @param pageNum The current results page
     * @param contentFilter
     */
    searchBlogs(query: string, pageNum: number, contentFilter: ContentFilter): Promise<PaginateResult<ContentModel>>;

    /**
     * Finds the current page of content results matching a user's query.
     *
     * @param query The user's query
     * @param pageNum The current results page
     * @param contentFilter
     */
    searchContent(query: string, pageNum: number, contentFilter: ContentFilter): Promise<PaginateResult<ContentModel>>;

    /**
     * Finds content tagged with the given fandom tag.
     * @param tagId Tag that searching for in content.
     * @param pageNum The current results page
     * @param contentFilter The content filter to apply to returned results.
     */
    getContentByFandomTag(tagId: string, pageNum: number, contentFilter: ContentFilter): Promise<PaginateResult<ContentModel>>;
}
