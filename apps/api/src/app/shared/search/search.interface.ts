import { PaginateResult } from 'mongoose';

import { ContentFilter, ContentModel } from '@dragonfish/shared/models/content';
import { SearchKind, SearchMatch } from '@dragonfish/shared/models/search';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

export interface ISearch {
    /**
     * Fetches search results given query for the specified kids
     *
     * @param query The user's query
     * @param searchKind The kind of content that searching for
     * @param author (Optional) The author of content that searching for
     * @param categoryKey (Optional) The category key of content that searching for
     * @param genreSearchMatch When searching genre, how the genres should match
     * @param genreKeys (Optional) The genre keys of content that searching for
     * @param tagIds (Optional) The fandom tags that searching for in content
     * @param includeChildTags When searching tags, if child tags should be searched too
     * @param pageNum The current results page
     * @param contentFilter Any available content filter
     */
    findRelatedContent(
        query: string,
        searchKind: SearchKind,
        author: string | null,
        categoryKey: string | null,
        genreSearchMatch: SearchMatch,
        genreKeys: string[] | null,
        tagIds: string[] | null,
        includeChildTags: boolean,
        pageNum: number,
        contentFilter: ContentFilter,
    ): Promise<PaginateResult<ContentModel>>;

    /**
     * Finds the current page of user results matching a user's query.
     *
     * @param query The user's query
     * @param pageNum The current results page
     */
    searchUsers(query: string, pageNum: number): Promise<PaginateResult<Pseudonym>>;

    /**
     * Finds content tagged with the given fandom tag.
     * @param tagId Tag that searching for in content.
     * @param pageNum The current results page
     * @param contentFilter The content filter to apply to returned results.
     */
    getContentByFandomTag(
        tagId: string,
        pageNum: number,
        contentFilter: ContentFilter,
    ): Promise<PaginateResult<ContentModel>>;
}
