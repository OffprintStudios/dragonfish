import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ContentGroupStore } from '../db/stores';
import { ContentFilter, ContentKind } from '$shared/models/content';
import { isNullOrUndefined } from '$shared/util';
import { ContentService } from '../services';

@Controller('browse')
export class BrowseController {
    constructor(
        private readonly contentGroupStore: ContentGroupStore,
        private readonly content: ContentService,
    ) {}

    @Get('fetch-first-new')
    async fetchFirstNew(@Query('filter') filter: ContentFilter) {
        return await this.contentGroupStore.fetchFirstNew(filter);
    }

    @Get('fetch-all-new')
    async fetchAllNew(
        @Query('filter') filter: ContentFilter,
        @Query('pageNum') pageNum: number,
        @Query('userId') userId: string,
        @Query('kind') kind: ContentKind[],
    ) {
        if (isNullOrUndefined(pageNum) && isNullOrUndefined(kind)) {
            throw new BadRequestException(
                `You must include both the page number and content kind in your request.`,
            );
        }

        return await this.contentGroupStore.fetchAllNew(pageNum, kind, filter, userId);
    }

    @Get('get-profile-content')
    async getProfileContent(
        @Query('pseudId') pseudId: string,
        @Query('filter') filter: ContentFilter,
    ) {
        return await this.content.getUserProfile(pseudId, filter);
    }
}
