import { Controller, UseGuards, Request, Get, Put, Body, Patch, BadRequestException, Param } from '@nestjs/common';

import { BlogForm, PubStatus } from '@pulp-fiction/models/content';
import { ContentService, BlogsService } from '../../../db/content';
import { AuthGuard } from '../../../guards';

@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) {}

    @UseGuards(AuthGuard)
    @Get('fetch-user-blogs/:pageNum')
    async fetchUserBlogs(@Request() req: any, @Param('pageNum') pageNum: number) {
        return await this.blogsService.fetchUserBlogs(req.user, pageNum);
    }

    @UseGuards(AuthGuard)
    @Put('create-blog')
    async createBlog(@Request() req: any, @Body() newBlog: BlogForm) {
        if (newBlog.title.length < 3 || newBlog.title.length > 100) {
            throw new BadRequestException("Your blog title must be between 3 and 100 characters.");
        }
        if (newBlog.body.length < 3) {
            throw new BadRequestException("Your blog body text must be at least 3 characters long.");
        }
        return await this.blogsService.createNewBlog(req.user, newBlog);
    }

    @UseGuards(AuthGuard)
    @Patch('delete-blog')
    async deleteBlog(@Request() req: any, @Body() blogId: {blogId: string}) {
        return await this.blogsService.deleteBlog(req.user, blogId.blogId);
    }

    @UseGuards(AuthGuard)
    @Patch('set-publish-status/:blogId')
    async setPublishStatus(@Request() req: any, @Param('blogId') blogId: string, @Body() pubStatus: PubStatus) {
        return await this.blogsService.changePublishStatus(req.user, blogId, pubStatus)
    }

    @UseGuards(AuthGuard)
    @Patch('edit-blog')
    async editBlog(@Request() req: any, @Body() editBlog: BlogForm) {
        if (editBlog.title.length < 3 || editBlog.title.length > 100) {
            throw new BadRequestException("Your blog title must be between 3 and 100 characters.");
        }
        if (editBlog.body.length < 3) {
            throw new BadRequestException("Your blog body text must be at least 3 characters long.");
        }
        return await this.blogsService.editBlog(req.user, editBlog);
    }

}