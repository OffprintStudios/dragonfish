import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';

import { ISearch } from '../../shared/search';
import { ContentFilter } from '@dragonfish/models/works';
import { InitialResults } from '@dragonfish/models/util';
import { UsersStore } from '../../db/users/users.store';
import { ContentStore } from '../../db/content';
import { User } from '@dragonfish/models/users';
import { ContentKind, ContentModel } from '@dragonfish/models/content';

@Injectable()
export class SearchService implements ISearch {
    constructor(private readonly usersService: UsersStore, private readonly contentService: ContentStore) {}

    async fetchInitialResults(query: string, contentFilter: ContentFilter): Promise<InitialResults> {
        const parsedQuery = `"${sanitizeHtml(query)}"`;

        const [initialUsers, initialBlogs, initialContent] = await Promise.all([
            this.usersService.findRelatedUsers(parsedQuery, 1, 6),
            this.contentService.findRelatedContent(parsedQuery, [ContentKind.BlogContent], 1, 6, contentFilter),
            this.contentService.findRelatedContent(
                parsedQuery,
                [ContentKind.PoetryContent, ContentKind.ProseContent],
                1,
                6,
                contentFilter,
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
        return await this.usersService.findRelatedUsers(parsedQuery, pageNum, 15);
    }

    async searchBlogs(
        query: string,
        pageNum: number,
        contentFilter: ContentFilter,
    ): Promise<PaginateResult<ContentModel>> {
        const parsedQuery = `"${sanitizeHtml(query)}"`;
        return await this.contentService.findRelatedContent(
            parsedQuery,
            [ContentKind.BlogContent],
            pageNum,
            15,
            contentFilter,
        );
    }

    async searchContent(
        query: string,
        pageNum: number,
        contentFilter: ContentFilter,
    ): Promise<PaginateResult<ContentModel>> {
        const parsedQuery = `"${sanitizeHtml(query)}"`;
        return await this.contentService.findRelatedContent(
            parsedQuery,
            [ContentKind.PoetryContent, ContentKind.ProseContent],
            pageNum,
            15,
            contentFilter,
        );
    }
}