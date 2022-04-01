import { Pseudonym } from '$shared/models/accounts';
import { ContentFilter, ContentModel } from '$shared/models/content';
import { SearchKind, SearchMatch } from '$shared/models/search';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

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

    @Get('get-user-results')
    async getUserResults(
        @Query('query') query: string,
        @Query('pageNum') pageNum: number,
    ): Promise<PaginateResult<Pseudonym>> {
        return await this.searchService.searchUsers(query, pageNum);
    }
}
