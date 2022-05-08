import { PseudonymsStore } from '$modules/accounts/db/stores';
import { Pseudonym } from '$shared/models/accounts';
import { ContentFilter, ContentModel, ContentKind, WorkKind, Genres } from '$shared/models/content';
import { SearchKind, SearchMatch } from '$shared/models/search';
import { htmlReplace } from '$shared/util';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import { ContentGroupStore } from '../db/stores';

@Injectable()
export class SearchService {
    readonly INITIAL_PAGE = 1;
    readonly INITIAL_MAX_PER_PAGE = 6;
    readonly MAX_PER_PAGE = 15;

    constructor(
        private readonly pseudStore: PseudonymsStore,
        private readonly contentGroupStore: ContentGroupStore,
    ) {}

    async findRelatedContent(
        query: string | null,
        searchKind: SearchKind,
        author: string | null,
        categoryKey: string | null,
        genreSearchMatch: SearchMatch,
        genreKeys: string[] | null,
        tagSearchMatch: SearchMatch,
        tagIds: string[] | null,
        includeChildTags: boolean,
        pageNum: number,
        contentFilter: ContentFilter,
    ): Promise<PaginateResult<ContentModel>> {
        const parsedQuery = query ? htmlReplace(sanitizeHtml(query)) : null;
        const kinds: ContentKind[] = [];
        switch (searchKind) {
            case SearchKind.Blog:
                kinds.push(ContentKind.BlogContent);
                break;
            case SearchKind.Poetry:
                kinds.push(ContentKind.PoetryContent);
                break;
            case SearchKind.ProseAndPoetry:
                kinds.push(ContentKind.PoetryContent, ContentKind.ProseContent);
                break;
            case SearchKind.Prose:
                kinds.push(ContentKind.ProseContent);
                break;
            case SearchKind.User:
                throw new BadRequestException('Use proper method to search users.');
            default:
                kinds.push(ContentKind.PoetryContent, ContentKind.ProseContent);
        }
        let authorId: string = null;
        if (author) {
            const users = await this.searchUsers(author, 1);
            if (users.totalDocs > 0) {
                authorId = users.docs[0]._id;
            }
        }
        // Category, match, and genre values are the keys, not the values
        let category: WorkKind = null;
        if (Object.values(WorkKind).indexOf(WorkKind[categoryKey]) >= 0) {
            category = WorkKind[categoryKey];
        }

        let genreMatch: SearchMatch = null;
        if (Object.values(SearchMatch).indexOf(SearchMatch[genreSearchMatch]) >= 0) {
            genreMatch = SearchMatch[genreSearchMatch];
        }

        const genreList: Genres[] = [];
        if (genreKeys) {
            for (const genre of genreKeys) {
                if (Object.values(Genres).indexOf(Genres[genre]) >= 0) {
                    genreList.push(genre as Genres);
                }
            }
        }

        let tagMatch: SearchMatch = null;
        if (Object.values(SearchMatch).indexOf(SearchMatch[tagSearchMatch]) >= 0) {
            tagMatch = SearchMatch[tagSearchMatch];
        }

        return await this.contentGroupStore.findRelatedContent(
            parsedQuery,
            kinds,
            authorId,
            category,
            genreMatch,
            genreList.length > 0 ? genreList : null,
            tagMatch,
            tagIds,
            includeChildTags,
            pageNum,
            this.MAX_PER_PAGE,
            contentFilter,
        );
    }

    async searchUsers(query: string, pageNum: number): Promise<PaginateResult<Pseudonym>> {
        const parsedQuery = htmlReplace(sanitizeHtml(query));
        return await this.pseudStore.findRelatedUsers(parsedQuery, pageNum, this.MAX_PER_PAGE);
    }
}
