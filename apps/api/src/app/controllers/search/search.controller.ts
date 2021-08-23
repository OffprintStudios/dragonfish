import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cookies } from '@nestjsplus/cookies';
import { PaginateResult } from 'mongoose';

import { ContentModel } from '@dragonfish/shared/models/content';
import { User } from '@dragonfish/shared/models/users';
import { InitialResults } from '@dragonfish/shared/models/util';
import { ContentFilter } from '@dragonfish/shared/models/works';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { ISearch } from '../../shared/search';

@Controller('search')
export class SearchController {
    constructor(@Inject('ISearch') private readonly searchService: ISearch) {}

    @ApiTags(DragonfishTags.Search)
    @Get('get-initial-results')
    async getInitialResults(
        @Query('query') query: string,
        @Cookies('contentFilter') contentFilter: ContentFilter
    ): Promise<InitialResults> {
        return await this.searchService.fetchInitialResults(query, contentFilter);
    }

    @ApiTags(DragonfishTags.Search)
    @Get('get-user-results')
    async getUserRequests(
        @Query('query') query: string,
        @Query('pageNum') pageNum: number
    ): Promise<PaginateResult<User>> {
        return await this.searchService.searchUsers(query, pageNum);
    }

    @ApiTags(DragonfishTags.Search)
    @Get('get-blog-results')
    async getBlogResults(
        @Query('query') query: string,
        @Query('pageNum') pageNum: number,
        @Cookies('contentFilter') contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        return await this.searchService.searchBlogs(query, pageNum, contentFilter);
    }

    @ApiTags(DragonfishTags.Search)
    @Get('get-work-results')
    async getWorkResults(
        @Query('query') query: string,
        @Query('pageNum') pageNum: number,
        @Cookies('contentFilter') contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        return await this.searchService.searchContent(query, pageNum, contentFilter);
    }

    @ApiTags(DragonfishTags.Search)
    @Get('get-fandom-tag-content')
    async getFandomTagContent(
        @Query('tagId') tagId: string,
        @Query('pageNum') pageNum: number,
        @Cookies('contentFilter') contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        return await this.searchService.searchFandomTagContent(tagId, pageNum, contentFilter);
    }
}
