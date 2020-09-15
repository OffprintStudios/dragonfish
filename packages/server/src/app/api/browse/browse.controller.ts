import { Controller, Get, Param } from '@nestjs/common';
import { Cookies } from '@nestjsplus/cookies';

import { ContentFilter } from '@pulp-fiction/models/works';
import { BrowseService } from './browse.service';

@Controller()
export class BrowseController {
    constructor(private readonly browseService: BrowseService) {}

    @Get('all-pub-works/:pageNum') 
    async getAllPubWorks(@Cookies('contentFilter') contentFilter: ContentFilter, @Param('pageNum') pageNum: number) {
        return await this.browseService.getAllNewPublishedWorks(contentFilter, pageNum);
    }
}
