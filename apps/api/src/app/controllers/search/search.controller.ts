import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cookies } from '@nestjsplus/cookies';
import { PaginateResult } from 'mongoose';

import { ContentModel } from '@dragonfish/shared/models/content';
import { InitialResults } from '@dragonfish/shared/models/util';
import { ContentFilter } from '@dragonfish/shared/models/works';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { ISearch } from '../../shared/search';
import { SearchCategory, SearchKind } from '@dragonfish/shared/models/search';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Controller('search')
export class SearchController {
    constructor(@Inject('ISearch') private readonly searchService: ISearch) {}

    /** DEPRECATED */
    @ApiTags(DragonfishTags.Search)
    @Get('get-initial-results')
    async getInitialResults(
        @Query('query') query: string,
        @Cookies('contentFilter') contentFilter: ContentFilter
    ): Promise<InitialResults> {
        return await this.searchService.fetchInitialResults(query, contentFilter);
    }

    @ApiTags(DragonfishTags.Search)
    @Get('find-related-content')
    async findRelatedContent(
        @Query('query') query: string,
        @Query('kind') kind: SearchKind,
        @Query('author') author: string,
        @Query('category') category: SearchCategory,
        @Query('pageNum') pageNum: number,
        @Cookies('contentFilter') contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        return await this.searchService.findRelatedContent(
            query,
            kind,
            author,
            category,
            pageNum,
            contentFilter
        );
    }

    @ApiTags(DragonfishTags.Search)
    @Get('get-user-results')
    async getUserResults(
        @Query('query') query: string,
        @Query('pageNum') pageNum: number
    ): Promise<PaginateResult<Pseudonym>> {
        return await this.searchService.searchUsers(query, pageNum);
    }

    /** DEPRECATED */
    @ApiTags(DragonfishTags.Search)
    @Get('get-blog-results')
    async getBlogResults(
        @Query('query') query: string,
        @Query('pageNum') pageNum: number,
        @Cookies('contentFilter') contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        return await this.searchService.searchBlogs(query, pageNum, contentFilter);
    }

    /** DEPRECATED */
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
    @Get('get-content-by-fandom-tag')
    async getContentByFandomTag(
        @Query('tagId') tagId: string,
        @Query('pageNum') pageNum: number,
        @Cookies('contentFilter') contentFilter: ContentFilter
    ): Promise<PaginateResult<ContentModel>> {
        return await this.searchService.getContentByFandomTag(tagId, pageNum, contentFilter);
    }
}
