import { get, writable } from 'svelte/store';
import type { SearchOptions } from '$lib/services/search.service';
import { ContentFilter, SearchKind, SearchMatch } from '$lib/models/content';
import { Genres, WorkKind } from '$lib/models/content/works';

interface SearchFormSelections {
    category: { value: string; label: string };
    genres: { value: string; label: string }[];
    fandoms: { value: string; label: string; isParent: boolean }[];
}

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
    const currentQuery = get(search);
    const currentSelections = get(searchSelect);

    // reset all previous state
    reset();

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
    const query = get(search).query;
    const author = get(search).author;
    const filter = get(search).filter;

    // reset from any previous state
    reset();

    // update with relevant parameters
    search.update((state) => ({
        ...state,
        query,
        author: author ?? null,
        filter,
        page,
    }));
}

export function searchUsers(page: number): void {
    // save current query
    const query = get(search).query;

    // reset from any previous state
    reset();

    // update with relevant parameters
    search.update((state) => ({
        ...state,
        query,
        page,
    }));
}

export function reset(): void {
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

    searchSelect.update((state) => ({
        ...state,
        category: null,
        genres: null,
        fandoms: null,
    }));
}

export function setCurrentTag(tagId: string, page: number): void {
    reset();
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
