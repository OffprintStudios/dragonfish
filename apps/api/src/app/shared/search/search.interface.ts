import { PaginateResult } from 'mongoose';

import { ContentFilter, ContentModel } from '@dragonfish/shared/models/content';
import { User } from '@dragonfish/shared/models/users';
import { InitialResults } from '@dragonfish/shared/models/util';

export interface ISearch {
    /**
     * Fetches the initial results for the search page.
     *
     * @param query The user's query
     * @param contentFilter Any available content filter
     */
    fetchInitialResults(query: string, contentFilter: ContentFilter): Promise<InitialResults>;

    /**
     * Finds the current page of user results matching a user's query.
     *
     * @param query The user's query
     * @param pageNum The current results page
     */
    searchUsers(query: string, pageNum: number): Promise<PaginateResult<User>>;

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
    searchFandomTagContent(tagId: string, pageNum: number, contentFilter: ContentFilter): Promise<PaginateResult<ContentModel>>;
}
