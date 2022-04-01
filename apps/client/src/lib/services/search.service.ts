import type { Profile } from '$lib/models/accounts';
import type { Content, ContentFilter } from '$lib/models/content';
import type { PaginateResult } from '$lib/models/util';
import { baseUrl } from '$lib/util';
import { http } from './http';
import type { SearchMatch, SearchKind } from '$lib/models/content';
import type { WorkKind } from '$lib/models/content/works';

export interface SearchOptions {
    // A user's query
    query: string;

    // The kind of content that we're searching for
    kind: SearchKind;

    // The current page
    page: number;

    // When searching tags, if child tags should be searched too
    includeChildTags: boolean;

    // The mature/explicit/etc. content filter to apply
    filter: ContentFilter;

    // When searching genre, how the genres should match; key of match type
    matchGenres: SearchMatch;

    // When searching tags, how the tags should match; key of match type
    matchTags: SearchMatch;

    // (Optional) The author of content that searching for
    author: string;

    // (Optional) The category key of content that searching for
    category: WorkKind;

    // (Optional) The genres of content that searching for
    genres: string[];

    // (Optional) The fandom tags that you're searching for
    tagIds: string[];
}

/**
 * Fetches search results given query for the specified kids
 *
 * @param options An object with various toggleable parameters
 */
export async function findRelatedContent(options: SearchOptions): Promise<PaginateResult<Content>> {
    const url =
        `${baseUrl}/search/find-related-content?` +
        `query=${options.query}&kind=${options.kind}&author=${options.author}&categoryKey=${options.category}` +
        `&genreSearchMatch=${options.matchGenres}&genreKeys=${
            options.genres ? options.genres.join(',') : null
        }` +
        `&tagSearchMatch=${options.matchTags}&tagIds=${
            options.tagIds ? options.tagIds.join(',') : null
        }&includeChildTags=${options.includeChildTags}` +
        `&pageNum=${options.page}&filter=${options.filter}`;
    return http.get<PaginateResult<Content>>(url).then((res) => {
        return res.data;
    });
}

export async function findUser(query: string, pageNum: number): Promise<PaginateResult<Profile>> {
    return http
        .get<PaginateResult<Profile>>(
            `${baseUrl}/search/get-user-results?query=${query}&pageNum=${pageNum}`,
        )
        .then((res) => {
            return res.data;
        });
}
