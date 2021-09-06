import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ContentGroupStore } from '@dragonfish/api/database/content/stores';
import { ApiTags } from '@nestjs/swagger';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { ContentFilter, ContentKind } from '@dragonfish/shared/models/content';
import { isNullOrUndefined } from '@dragonfish/shared/functions';

@ApiTags(DragonfishTags.Content)
@Controller('browse')
export class BrowseController {
    constructor(private readonly contentGroupStore: ContentGroupStore) {}

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
            throw new BadRequestException(`You must include both the page number and content kind in your request.`);
        }

        return await this.contentGroupStore.fetchAllNew(pageNum, kind, filter, userId);
    }
}
