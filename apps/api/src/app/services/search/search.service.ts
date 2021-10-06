import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';

import { ISearch } from '../../shared/search';
import { ContentFilter } from '@dragonfish/shared/models/works';
import { InitialResults } from '@dragonfish/shared/models/util';
import { SearchKind } from '@dragonfish/shared/models/search';
import { ContentGroupStore } from '@dragonfish/api/database/content/stores';
import { ContentKind, ContentModel, WorkKind } from '@dragonfish/shared/models/content';
import { PseudonymsStore } from '@dragonfish/api/database/accounts/stores';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Injectable()
export class SearchService implements ISearch {
    readonly INITIAL_PAGE = 1;
    readonly INITIAL_MAX_PER_PAGE = 6;
    readonly MAX_PER_PAGE = 15;

    constructor(private readonly pseudStore: PseudonymsStore, private readonly contentGroupStore: ContentGroupStore) {}

    /** DEPRECATED */
    async fetchInitialResults(query: string, contentFilter: ContentFilter): Promise<InitialResults> {
        // const parsedQuery = `"${sanitizeHtml(query)}"`;

        // const [initialUsers, initialBlogs, initialContent] = await Promise.all([
        //     this.usersStore.findRelatedUsers(parsedQuery, this.INITIAL_PAGE, this.INITIAL_MAX_PER_PAGE),
        //     this.contentGroupStore.findRelatedContent(parsedQuery,
        //         [ContentKind.BlogContent],
        //         null,
        //         null,
        //         this.INITIAL_PAGE,
        //         this.INITIAL_MAX_PER_PAGE,
        //         contentFilter
        //     ),
        //     this.contentGroupStore.findRelatedContent(
        //         parsedQuery,
        //         [ContentKind.PoetryContent, ContentKind.ProseContent],
        //         null,
        //         null,
        //         this.INITIAL_PAGE,
        //         this.INITIAL_MAX_PER_PAGE,
        //         contentFilter
        //     ),
        // ]);

        // const result: InitialResults = {
        //     users: initialUsers.docs,
        //     blogs: initialBlogs.docs,
        //     works: initialContent.docs,
        // };
        // return result;
        return null;
    }

    async findRelatedContent(
        query: string,
        searchKind: SearchKind,
        author: string | null,
        category: WorkKind | null,
        pageNum: number,
        contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        const parsedQuery = `"${sanitizeHtml(query)}"`;
        const kinds: ContentKind[] = [];
        switch (searchKind) {
            case SearchKind.Blog:
                kinds.push(ContentKind.BlogContent);
                break;
            case SearchKind.News:
                kinds.push(ContentKind.NewsContent);
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
            let users = await this.searchUsers(author, 1);
            if (users.totalDocs > 0) {
                authorId = users.docs[0]._id;
            }
        }
        if (Object.values(WorkKind).indexOf(category) < 0) {
            category = null;
        }

        return await this.contentGroupStore.findRelatedContent(
            parsedQuery,
            kinds,
            authorId,
            category,
            pageNum,
            this.MAX_PER_PAGE,
            contentFilter
        );
    }

    async searchUsers(query: string, pageNum: number): Promise<PaginateResult<Pseudonym>> {
        const parsedQuery = sanitizeHtml(query);
        return await this.pseudStore.findRelatedUsers(parsedQuery, pageNum, this.MAX_PER_PAGE);
    }

    /** DEPRECATED */
    async searchBlogs(
        query: string,
        pageNum: number,
        contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        const parsedQuery = `"${sanitizeHtml(query)}"`;
        return await this.contentGroupStore.findRelatedContent(
            parsedQuery,
            [ContentKind.BlogContent],
            null,
            null,
            pageNum,
            this.MAX_PER_PAGE,
            contentFilter
        );
    }

    /** DEPRECATED */
    async searchContent(
        query: string,
        pageNum: number,
        contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        const parsedQuery = `"${sanitizeHtml(query)}"`;
        return await this.contentGroupStore.findRelatedContent(
            parsedQuery,
            [ContentKind.PoetryContent, ContentKind.ProseContent],
            null,
            null,
            pageNum,
            this.MAX_PER_PAGE,
            contentFilter
        );
    }

    async getContentByFandomTag(
        tagId: string,
        pageNum: number,
        contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        return await this.contentGroupStore.getContentByFandomTag(
            tagId,
            [ContentKind.PoetryContent, ContentKind.ProseContent],
            pageNum,
            this.MAX_PER_PAGE,
            contentFilter
        )
    }
}
