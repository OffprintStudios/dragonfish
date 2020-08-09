import { Controller, Get, Query } from '@nestjs/common';

import { SearchService } from './search.service';

@Controller()
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('find-results')
    async findResults(@Query('query') query: string, @Query('pageNum') pageNum: number) {
        console.log(`Query: ${query}\nPage Number: ${pageNum}`);
    }

    @Get('find-user-results')
    async findUserRequests(@Query('query') query: string, @Query('pageNum') pageNum: number) {
        return await this.searchService.searchUsers(query, pageNum);
    }

    @Get('find-work-results')
    async findWorkResults(@Query('query') query: string, @Query('pageNum') pageNum: number) {

    }

    @Get('find-blog-results')
    async findBlogResults(@Query('query') query: string, @Query('pageNum') pageNum: number) {

    }
}
