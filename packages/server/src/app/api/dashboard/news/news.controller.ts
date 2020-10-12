import { Controller, Request, UseGuards, Body, Param, Put, Patch, Get } from '@nestjs/common';

import { RolesGuard } from '../../../guards';
import { NewsService } from '../../../db/content/news/news.service';
import { Roles } from '@pulp-fiction/models/users';
import { PostForm } from '@pulp-fiction/models/news';

@Controller('news')
export class NewsController {
    constructor (private newsService: NewsService) {}

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator, Roles.Contributor]))
    @Put('create-post')
    async createPost(@Request() req: any, @Body() postInfo: PostForm) {
        return await this.newsService.createNewPost(req.user, postInfo);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator, Roles.Contributor]))
    @Patch('edit-post/:postId')
    async editPost(@Request() req: any, @Param('postId') postId: string, @Body() postInfo: PostForm) {
        console.log(`Controller: ${postId}\n`);
        return await this.newsService.editPost(req.user, postId, postInfo);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator, Roles.Contributor]))
    @Get('fetch-all/:pageNum')
    async fetchAll(@Request() _req: any, @Param('pageNum') pageNum: number) {
        return await this.newsService.fetchAllForDashboard(pageNum);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator, Roles.Contributor]))
    @Get('fetch-for-edit/:postId')
    async fetchForEdit(@Request() req: any, @Param('postId') postId: string) {
        return await this.newsService.fetchForEdit(req.user, postId);
    }

    @UseGuards(RolesGuard([Roles.Admin, Roles.Moderator, Roles.Contributor]))
    @Patch('set-publish-status/:postId')
    async setPublishStatus(@Request() req: any, @Param('postId') postId: string, @Body() pubStatus: object) {
        console.log(pubStatus);
    }
}
