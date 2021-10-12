import { Controller, Get, Query } from '@nestjs/common';
import { ContentGroupStore } from '@dragonfish/api/database/content/stores';

@Controller('news')
export class NewsController {
    constructor(private readonly contentGroupStore: ContentGroupStore) {}

    @Get('initial-posts')
    async getInitialPosts() {
        return await this.contentGroupStore.fetchForHome();
    }

    @Get('news-feed')
    async getNewsFeed(@Query('page') page: number) {
        return await this.contentGroupStore.fetchNewsFeed(page);
    }
}
