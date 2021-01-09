import { Controller, Get, Query } from '@nestjs/common';
import { Cookies } from '@nestjsplus/cookies';

import { ContentModel } from '@pulp-fiction/models/content';
import { User } from '@pulp-fiction/models/users';
import { InitialResults, PaginateResult } from '@pulp-fiction/models/util';
import { ContentFilter } from '@pulp-fiction/models/works';

import { SearchService } from './search.service';

@Controller()
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get('get-initial-results')
    async getInitialResults(@Query('query') query: string, @Cookies('contentFilter') contentFilter: ContentFilter): Promise<InitialResults> {
        return await this.searchService.fetchInitialResults(query, contentFilter);
    }

    @Get('get-user-results')
    async getUserRequests(@Query('query') query: string, @Query('pageNum') pageNum: number): Promise<PaginateResult<User>> {
        return await this.searchService.searchUsers(query, pageNum);
    }

    @Get('get-blog-results')
    async getBlogResults(@Query('query') query: string, @Query('pageNum') pageNum: number, @Cookies('contentFilter') contentFilter: ContentFilter): Promise<PaginateResult<ContentModel>> {
        return await this.searchService.searchBlogs(query, pageNum, contentFilter);
    }

    @Get('get-work-results')
    async getWorkResults(@Query('query') query: string, @Query('pageNum') pageNum: number, @Cookies('contentFilter') contentFilter: ContentFilter): Promise<PaginateResult<ContentModel>> {
        return await this.searchService.searchWorks(query, pageNum, contentFilter);
    }
}
