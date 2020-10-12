import { Controller, Get, Query } from '@nestjs/common';
import { Cookies } from '@nestjsplus/cookies';

import { ContentFilter } from '@pulp-fiction/models/works';
import { SearchService } from './search.service';

@Controller()
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('get-initial-results')
    async getInitialResults(@Query('query') query: string, @Cookies('contentFilter') contentFilter: ContentFilter) {
        return await this.searchService.fetchInitialResults(query, contentFilter);
    }

    @Get('get-user-results')
    async getUserRequests(@Query('query') query: string, @Query('pageNum') pageNum: number) {
        return await this.searchService.searchUsers(query, pageNum);
    }

    @Get('get-blog-results')
    async getBlogResults(@Query('query') query: string, @Query('pageNum') pageNum: number) {
        return await this.searchService.searchBlogs(query, pageNum);
    }

    @Get('get-work-results')
    async getWorkResults(@Query('query') query: string, @Query('pageNum') pageNum: number, @Cookies('contentFilter') contentFilter: ContentFilter) {
        return await this.searchService.searchWorks(query, pageNum, contentFilter);
    }
}
