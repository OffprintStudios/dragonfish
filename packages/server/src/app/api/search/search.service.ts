import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { sanitizeHtml } from '@dragonfish/html_sanitizer'
import { ContentFilter } from '@dragonfish/models/works';
import { InitialResults } from '@dragonfish/models/util';

import { UsersService } from '../../db/users/users.service';
import { BlogsService, ContentService } from '../../db/content';
import { User } from '@dragonfish/models/users';
import { BlogsContentModel, ContentKind, ContentModel } from '@dragonfish/models/content';

@Injectable()
export class SearchService {
    constructor(private readonly usersService: UsersService,
        private readonly contentService: ContentService) { }

    async fetchInitialResults(query: string, contentFilter: ContentFilter): Promise<InitialResults> {
        const parsedQuery = `"${await sanitizeHtml(query)}"`;

        const [initialUsers, initialBlogs, initialContent] = await Promise.all([
            this.usersService.findRelatedUsers(parsedQuery, 1, 6),
            this.contentService.findRelatedContent(parsedQuery, [ContentKind.BlogContent], 1, 6, contentFilter),
            this.contentService.findRelatedContent(parsedQuery, [ContentKind.PoetryContent, ContentKind.ProseContent], 1, 6, contentFilter)
        ]);        

        const result: InitialResults = {
            users: initialUsers.docs,
            blogs: initialBlogs.docs,
            works: initialContent.docs            
        };
        return result;
    }
    
    async searchUsers(query: string, pageNum: number): Promise<PaginateResult<User>> {
        const parsedQuery = `"${await sanitizeHtml(query)}"`;
        return await this.usersService.findRelatedUsers(parsedQuery, pageNum, 15);
    }

    async searchBlogs(query: string, pageNum: number, contentFilter: ContentFilter): Promise<PaginateResult<ContentModel>> {
        const parsedQuery = `"${await sanitizeHtml(query)}"`;
        return await this.contentService.findRelatedContent(parsedQuery, [ContentKind.BlogContent], pageNum, 15, contentFilter);
    }

    async searchWorks(query: string, pageNum: number, contentFilter: ContentFilter): Promise<PaginateResult<ContentModel>> {
        const parsedQuery = `"${await sanitizeHtml(query)}"`;
        return await this.contentService.findRelatedContent(parsedQuery, [ContentKind.PoetryContent, ContentKind.ProseContent], pageNum, 15, contentFilter);
    }
}
