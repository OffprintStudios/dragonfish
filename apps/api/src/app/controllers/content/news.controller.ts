import { Controller, Param, Get, UseGuards } from '@nestjs/common';
import { Cookies } from '@nestjsplus/cookies';

import { ContentStore } from '../../db/content/content.store';
import { OptionalAuthGuard } from '../../guards';
import { ContentFilter, ContentKind } from '@dragonfish/shared/models/content';
import { NewsStore } from '../../db/content';
import { User } from '../../util/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';

@Controller('news')
export class NewsController {
    constructor(private readonly contentService: ContentStore, private readonly newsService: NewsStore) {}

    @Get('initial-posts')
    async getInitialPosts(@Cookies('contentFilter') filter: ContentFilter) {
        return await this.newsService.fetchForHome(filter);
    }

    @Get('news-feed/:pageNum')
    async getNewsFeed(@Param('pageNum') pageNum: number, @Cookies('contentFilter') filter: ContentFilter) {
        return await this.contentService.fetchAllPublished(pageNum, [ContentKind.NewsContent], filter);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('news-post/:postId')
    async getNewsPost(@User() user: JwtPayload, @Param('postId') postId: string) {
        return await this.contentService.fetchOnePublished(
            postId, // the contentId of the post
            ContentKind.NewsContent, // fetch only a news post
            user // add a view if there's a user
        );
    }
}
