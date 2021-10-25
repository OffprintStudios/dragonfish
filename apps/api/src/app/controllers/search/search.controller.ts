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
        @Query('query') query: string | null,
        @Query('kind') kind: SearchKind,
        @Query('author') author: string | null,
        @Query('categoryKey') categoryKey: string | null,
        @Query('genreSearchMatch') genreSearchMatch: SearchMatch,
        @Query('genreKeys') genreKeys: string,
        @Query('tagSearchMatch') tagSearchMatch: SearchMatch,
        @Query('tagIds') tagIds: string,
        @Query('includeChildTags') includeChildTags: string,
        @Query('pageNum') pageNum: number,
        @Query('filter') filter: ContentFilter,
    ): Promise<PaginateResult<ContentModel>> {
        if (query === 'null') query = null;
        const genresList = genreKeys && genreKeys !== 'null' ? genreKeys.split(',') : null;
        const tagsList = tagIds && tagIds !== 'null' ? tagIds.split(',') : null;

        return await this.searchService.findRelatedContent(
            query,
            kind,
            author,
            categoryKey,
            genreSearchMatch,
            genresList,
            tagSearchMatch,
            tagsList,
            includeChildTags === 'true',
            pageNum,
            filter,
        );
    }

    @ApiTags(DragonfishTags.Search)
    @Get('get-user-results')
    async getUserResults(
        @Query('query') query: string,
        @Query('pageNum') pageNum: number,
    ): Promise<PaginateResult<Pseudonym>> {
        return await this.searchService.searchUsers(query, pageNum);
    }
}
