import { get, writable } from 'svelte/store';
import type { SearchOptions } from '$lib/services/search.service';
import { ContentFilter, SearchKind, SearchMatch } from '$lib/models/content';
import { WorkKind } from '$lib/models/content/works';

interface SearchFormSelections {
    category: { value: string; label: string };
    genres: { value: string; label: string }[];
    fandoms: { value: string; label: string; isParent: boolean }[];
}

/**
 * What searching with
 */
export const search = writable<SearchOptions>({
    author: null,
    category: null,
    filter: ContentFilter.Default,
    genres: null,
    includeChildTags: true,
    kind: SearchKind.ProseAndPoetry,
    matchGenres: SearchMatch.All,
    matchTags: SearchMatch.All,
    page: 1,
    query: '',
    tagIds: null,
});

/**
 * What user has selected; search set to this when submit
 */
export const searchOptions = writable<SearchOptions>({
    author: null,
    category: null,
    filter: ContentFilter.Default,
    genres: null,
    includeChildTags: true,
    kind: SearchKind.ProseAndPoetry,
    matchGenres: SearchMatch.All,
    matchTags: SearchMatch.All,
    page: 1,
    query: '',
    tagIds: null,
});

/**
 * What user has selected; search set to this when submit
 */
export const searchSelect = writable<SearchFormSelections>({
    category: null,
    genres: null,
    fandoms: null,
});

export function setFilter(filter: ContentFilter): void {
    search.update((state) => ({
        ...state,
        filter,
    }));
}

export function searchWorks(page: number): void {
    // save current query
    const currentQuery = get(searchOptions);
    const currentSelections = get(searchSelect);

    // reset all previous state
    resetSearch();

    // migrate selections to appropriate enums
    const genres = currentSelections.genres
        ? currentSelections.genres.map((val) => {
              return val.value;
          })
        : null;
    const fandoms = currentSelections.fandoms
        ? currentSelections.fandoms.map((val) => {
              return val.value;
          })
        : null;

    console.log(genres);
    console.log(fandoms);

    // update with relevant parameters
    search.update((state) => ({
        ...state,
        author: currentQuery.author,
        category: currentSelections.category ? WorkKind[currentSelections.category.value] : null,
        filter: ContentFilter[currentQuery.filter],
        genres: genres,
        includeChildTags: showChildTags(currentSelections.fandoms),
        kind: currentQuery.kind,
        matchGenres: currentQuery.matchGenres,
        matchTags: currentQuery.matchTags,
        page: page,
        query: currentQuery.query,
        tagIds: fandoms,
    }));
}

export function searchBlogs(page: number): void {
    // save current query
    const query = get(searchOptions).query;
    const author = get(searchOptions).author;
    const filter = get(searchOptions).filter;

    // reset from any previous state
    resetSearch();

    // update with relevant parameters
    search.update((state) => ({
        ...state,
        query,
        author: author ?? null,
        filter,
        kind: SearchKind.Blog,
        page,
    }));
}

export function searchUsers(page: number): void {
    // save current query
    const query = get(searchOptions).query;

    // reset from any previous state
    resetSearch();

    // update with relevant parameters
    search.update((state) => ({
        ...state,
        query,
        kind: SearchKind.User,
        page,
    }));
}

export function resetSearch(): void {
    search.update((state) => ({
        ...state,
        author: null,
        category: null,
        filter: ContentFilter.Default,
        genres: null,
        includeChildTags: true,
        kind: SearchKind.ProseAndPoetry,
        matchGenres: SearchMatch.All,
        matchTags: SearchMatch.All,
        page: 1,
        query: '',
        tagIds: null,
    }));
}

export function resetSearchOptions(): void {
    searchOptions.update((state) => ({
        ...state,
        author: null,
        category: null,
        filter: ContentFilter.Default,
        genres: null,
        includeChildTags: true,
        kind: SearchKind.ProseAndPoetry,
        matchGenres: SearchMatch.All,
        matchTags: SearchMatch.All,
        page: 1,
        query: '',
        tagIds: null,
    }));
}

/**
 * Used in tag page
 * @param tagId
 * @param page
 */
export function setCurrentTag(tagId: string, page: number): void {
    resetSearch();
    search.update((state) => ({
        ...state,
        tagIds: [tagId],
        page,
    }));
}

function showChildTags(fandoms: { label: string; value: string; isParent: boolean }[]) {
    if (fandoms !== null && get(search).matchTags !== SearchMatch.Exactly) {
        for (const tag of fandoms) {
            if (tag.isParent) {
                return true;
            }
        }
    }
    return false;
}
