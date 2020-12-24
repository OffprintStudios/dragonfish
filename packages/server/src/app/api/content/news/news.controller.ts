import { Controller, Request, Param, Get, UseGuards } from '@nestjs/common';

import { ContentService } from '../../../db/content/content.service';
import { OptionalAuthGuard } from '../../../guards';
import { ContentKind } from '@pulp-fiction/models/content';

@Controller('news')
export class NewsController {
    constructor(private readonly contentService: ContentService) {}

    @Get('news-feed/:pageNum')
    async getNewsFeed(@Param('pageNum') pageNum: number) {
        return await this.contentService.fetchAllPublished(pageNum, [ContentKind.NewsContent]);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('news-post/:postId')
    async getNewsPost(@Request() req: any, @Param('postId') postId: string) {
        return await this.contentService.fetchOnePublished(
            postId, // the contentId of the post
            ContentKind.NewsContent, // fetch only a news post
            req.user, // add a view if there's a user
        );
    }
}
