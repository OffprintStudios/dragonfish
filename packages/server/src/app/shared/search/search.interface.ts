import { PaginateResult } from 'mongoose';

import { ContentFilter, ContentModel } from '@dragonfish/models/content';
import { User } from '@dragonfish/models/users';
import { InitialResults } from '@dragonfish/models/util';

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
     */
    searchBlogs(query: string, pageNum: number, contentFilter: ContentFilter): Promise<PaginateResult<ContentModel>>;

    /**
     * Finds the current page of content results matching a user's query.
     * 
     * @param query The user's query
     * @param pageNum The current results page
     */
    searchContent(query: string, pageNum: number, contentFilter: ContentFilter): Promise<PaginateResult<ContentModel>>;
}