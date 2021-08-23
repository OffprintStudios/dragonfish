import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';

import { ISearch } from '../../shared/search';
import { ContentFilter } from '@dragonfish/shared/models/works';
import { InitialResults } from '@dragonfish/shared/models/util';
import { UsersStore } from '@dragonfish/api/database/users';
import { BrowseStore } from '@dragonfish/api/database/content/stores';
import { User } from '@dragonfish/shared/models/users';
import { ContentKind, ContentModel } from '@dragonfish/shared/models/content';

@Injectable()
export class SearchService implements ISearch {
    INITIAL_PAGE = 1;
    INITIAL_MAX_PER_PAGE = 6;
    MAX_PER_PAGE = 15;

    constructor(private readonly usersStore: UsersStore, private readonly contentStore: BrowseStore) {}

    async fetchInitialResults(query: string, contentFilter: ContentFilter): Promise<InitialResults> {
        const parsedQuery = `"${sanitizeHtml(query)}"`;

        const [initialUsers, initialBlogs, initialContent] = await Promise.all([
            this.usersStore.findRelatedUsers(parsedQuery, this.INITIAL_PAGE, this.INITIAL_MAX_PER_PAGE),
            this.contentStore.findRelatedContent(parsedQuery,
                [ContentKind.BlogContent],
                this.INITIAL_PAGE,
                this.INITIAL_MAX_PER_PAGE,
                contentFilter
            ),
            this.contentStore.findRelatedContent(
                parsedQuery,
                [ContentKind.PoetryContent, ContentKind.ProseContent],
                this.INITIAL_PAGE,
                this.INITIAL_MAX_PER_PAGE,
                contentFilter
            ),
        ]);

        const result: InitialResults = {
            users: initialUsers.docs,
            blogs: initialBlogs.docs,
            works: initialContent.docs,
        };
        return result;
    }

    async searchUsers(query: string, pageNum: number): Promise<PaginateResult<User>> {
        const parsedQuery = `"${sanitizeHtml(query)}"`;
        return await this.usersStore.findRelatedUsers(parsedQuery, pageNum, this.MAX_PER_PAGE);
    }

    async searchBlogs(
        query: string,
        pageNum: number,
        contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        const parsedQuery = `"${sanitizeHtml(query)}"`;
        return await this.contentStore.findRelatedContent(
            parsedQuery,
            [ContentKind.BlogContent],
            pageNum,
            this.MAX_PER_PAGE,
            contentFilter
        );
    }

    async searchContent(
        query: string,
        pageNum: number,
        contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        const parsedQuery = `"${sanitizeHtml(query)}"`;
        return await this.contentStore.findRelatedContent(
            parsedQuery,
            [ContentKind.PoetryContent, ContentKind.ProseContent],
            pageNum,
            this.MAX_PER_PAGE,
            contentFilter
        );
    }

    async searchFandomTagContent(
        tagId: string,
        pageNum: number,
        contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        return await this.contentStore.findFandomTagContent(
            tagId,
            [ContentKind.PoetryContent, ContentKind.ProseContent],
            pageNum,
            this.MAX_PER_PAGE,
            contentFilter
        )
    }
}
