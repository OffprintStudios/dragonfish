import { Controller, UseGuards, Request, Get, Put, Body, Patch, BadRequestException, Param } from '@nestjs/common';

import * as models from '@pulp-fiction/models/blogs';
import { BlogsService } from '../../../db/blogs/blogs.service';
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
    async createBlog(@Request() req: any, @Body() newBlog: models.CreateBlog) {
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
    @Patch('set-publish-status')
    async setPublishStatus(@Request() req: any, @Body() pubStatus: models.SetPublishStatus) {
        return await this.blogsService.setPublishStatus(req.user, pubStatus);
    }

    @UseGuards(AuthGuard)
    @Patch('edit-blog')
    async editBlog(@Request() req: any, @Body() editBlog: models.EditBlog) {
        if (editBlog.title.length < 3 || editBlog.title.length > 100) {
            throw new BadRequestException("Your blog title must be between 3 and 100 characters.");
        }
        if (editBlog.body.length < 3) {
            throw new BadRequestException("Your blog body text must be at least 3 characters long.");
        }
        return await this.blogsService.editBlog(req.user, editBlog);
    }

}