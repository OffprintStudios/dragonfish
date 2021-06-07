import { Controller, Param, Get, UseGuards } from '@nestjs/common';
import { Cookies } from '@nestjsplus/cookies';
import { BrowseStore } from '@dragonfish/api/database/content/stores';
import { OptionalAuthGuard } from '@dragonfish/api/utilities/guards';
import { ContentFilter, ContentKind } from '@dragonfish/shared/models/content';
import { User } from '@dragonfish/api/utilities/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';

@Controller('news')
export class NewsController {
    constructor(private readonly browse: BrowseStore) {}

    @Get('initial-posts')
    async getInitialPosts() {
        return await this.browse.fetchForHome();
    }

    @Get('news-feed/:pageNum')
    async getNewsFeed(@Param('pageNum') pageNum: number, @Cookies('contentFilter') filter: ContentFilter) {
        return await this.browse.fetchAllPublished(pageNum, [ContentKind.NewsContent], filter);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('news-post/:postId')
    async getNewsPost(@User() user: JwtPayload, @Param('postId') postId: string) {
        return await this.browse.fetchOnePublished(
            postId, // the contentId of the post
            ContentKind.NewsContent, // fetch only a news post
            user, // add a view if there's a user
        );
    }
}
