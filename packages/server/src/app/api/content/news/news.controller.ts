import { Controller, Request, Param, Get, UseGuards } from '@nestjs/common';

import { ContentService } from '../../../db/content/content.service';
import { OptionalAuthGuard } from '../../../guards';

@Controller('news')
export class NewsController {
    constructor(private readonly contentService: ContentService) {}

    @Get('news-feed/:pageNum')
    async getNewsFeed(@Param('pageNum') pageNum: number) {
        return await this.contentService.fetchManyByKind('NewsContent', pageNum, true);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('news-post/:postId')
    async getNewsPost(@Request() req: any, @Param('postId') postId: string) {
        return await this.contentService.fetchOnePublished(postId, 'NewsContent', req.user);
    }
}
