import { Controller, Get } from '@nestjs/common';
import { ContentService } from '$modules/content/services';

@Controller('news')
export class NewsController {
    constructor(private readonly content: ContentService) {}

    @Get('fetch-for-home')
    async fetchForHome() {
        return await this.content.fetchFirstNewsPosts();
    }

    @Get('fetch-featured')
    async fetchFeatured() {
        return await this.content.fetchFeaturedPosts();
    }
}
