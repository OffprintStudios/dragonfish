import { Controller, Param, Get, UseGuards } from '@nestjs/common';
import { Cookies } from '@nestjsplus/cookies';
import { ContentGroupStore } from '@dragonfish/api/database/content/stores';
import { OptionalAuthGuard } from '../../guards';
import { ContentFilter, ContentKind } from '@dragonfish/shared/models/content';
import { User } from '@dragonfish/api/utilities/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';

@Controller('news')
export class NewsController {
    constructor(private readonly contentGroupStore: ContentGroupStore) {}

    @Get('initial-posts')
    async getInitialPosts() {
        return await this.contentGroupStore.fetchForHome();
    }

    @Get('news-feed/:pageNum')
    async getNewsFeed(@Param('pageNum') pageNum: number, @Cookies('contentFilter') filter: ContentFilter) {
        return await this.contentGroupStore.fetchAllPublished(pageNum, [ContentKind.NewsContent], filter);
    }

    @UseGuards(OptionalAuthGuard)
    @Get('news-post/:postId')
    async getNewsPost(@User() user: JwtPayload, @Param('postId') postId: string) {
        return await this.contentGroupStore.fetchOnePublished(
            postId, // the contentId of the post
            ContentKind.NewsContent, // fetch only a news post
            user, // add a view if there's a user
        );
    }
}
