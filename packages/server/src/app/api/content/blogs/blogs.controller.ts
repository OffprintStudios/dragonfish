import { Controller, UseGuards, Request, Put, Body, Patch, BadRequestException, Param, Query } from '@nestjs/common';
import { Types } from 'mongoose';

import { BlogForm, PubChange } from '@pulp-fiction/models/content';
import { ContentService, BlogsService } from '../../../db/content';
import { AuthGuard } from '../../../guards';
import { ContentFoldersService } from '../../../db/content-folders/content-folders.service';

@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService, private readonly contentService: ContentService, 
        private readonly folderService: ContentFoldersService) {}

    @UseGuards(AuthGuard)
    @Put('create-blog')
    async createBlog(@Request() req: any, @Body() newBlog: BlogForm, @Query('parentId') parentId: string) {
        if (newBlog.title.length < 3 || newBlog.title.length > 100) {
            throw new BadRequestException("Your blog title must be between 3 and 100 characters.");
        }
        if (newBlog.body.length < 3) {
            throw new BadRequestException("Your blog body text must be at least 3 characters long.");
        }

        if (parentId) {
            const folderId = Types.ObjectId(parentId);
            const blog = await this.blogsService.createNewBlog(req.user, newBlog, folderId);
            await this.folderService.addToFolder(req.user, folderId, blog._id);
            return blog;
        } else {
            return await this.blogsService.createNewBlog(req.user, newBlog);
        }
    }

    @UseGuards(AuthGuard)
    @Patch('delete-blog/:blogId')
    async deleteBlog(@Request() req: any, @Param('blogId') blogId: string) {
        return await this.contentService.deleteOne(req.user, blogId);
    }

    @UseGuards(AuthGuard)
    @Patch('set-publish-status/:blogId')
    async setPublishStatus(@Request() req: any, @Param('blogId') blogId: string, @Body() pubChange: PubChange) {
        return await this.blogsService.changePublishStatus(req.user, blogId, pubChange)
    }

    @UseGuards(AuthGuard)
    @Patch('edit-blog/:blogId')
    async editBlog(@Request() req: any, @Param('blogId') blogId: string, @Body() editBlog: BlogForm) {
        if (editBlog.title.length < 3 || editBlog.title.length > 100) {
            throw new BadRequestException("Your blog title must be between 3 and 100 characters.");
        }
        if (editBlog.body.length < 3) {
            throw new BadRequestException("Your blog body text must be at least 3 characters long.");
        }
        return await this.blogsService.editBlog(req.user, blogId, editBlog);
    }

}