import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cookies } from '@nestjsplus/cookies';
import { PaginateResult } from 'mongoose';

import { ContentModel } from '@dragonfish/shared/models/content';
import { ContentFilter } from '@dragonfish/shared/models/works';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { ISearch } from '../../shared/search';
import { SearchKind, SearchMatch } from '@dragonfish/shared/models/search';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Controller('search')
export class SearchController {
    constructor(@Inject('ISearch') private readonly searchService: ISearch) {}

    @ApiTags(DragonfishTags.Search)
    @Get('find-related-content')
    async findRelatedContent(
        @Query('query') query: string,
        @Query('kind') kind: SearchKind,
        @Query('author') author: string | null,
        @Query('categoryKey') categoryKey: string | null,
        @Query('genreKeys') genreKeys: string,
        @Query('genreSearchMatch') genreSearchMatch: SearchMatch,
        @Query('pageNum') pageNum: number,
        @Query('filter') filter: ContentFilter,
    ): Promise<PaginateResult<ContentModel>> {
        const genresList = genreKeys.split(',');

        return await this.searchService.findRelatedContent(
            query,
            kind,
            author,
            categoryKey,
            genresList,
            genreSearchMatch,
            pageNum,
            filter
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
