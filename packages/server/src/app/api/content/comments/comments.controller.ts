import { Controller, UseGuards, Request, Param, Body, Get, Put, Patch, Post } from '@nestjs/common';

import { Roles } from '@pulp-fiction/models/users';
import { RolesGuard } from '../../../guards';
import { CreateComment, EditComment } from '@pulp-fiction/models/comments';
import { CommentsService } from '../../../db/comments/comments.service';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Put('add-blog-comment/:blogId')
    async addBlogComment(@Request() req: any, @Param('blogId') blogId: string, @Body() commentInfo: CreateComment) {
        return await this.commentsService.createBlogComment(req.user, blogId, commentInfo);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Put('add-work-comment/:workId')
    async addWorkComment(@Request() req: any, @Param('workId') workId: string, @Body() commentInfo: CreateComment) {
        return await this.commentsService.createWorkComment(req.user, workId, commentInfo);
    }

    @Get('get-blog-comments/:blogId')
    async getBlogComments(@Param('blogId') blogId: string) {
        return await this.commentsService.getBlogComments(blogId);
    }

    @Get('get-work-comments/:workId')
    async getWorkComments(@Param('workId') workId: string) {
        return await this.commentsService.getWorkComments(workId);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-comment/:commentId')
    async editComment(@Request() req: any, @Param('commentId') commentId: string, @Body() commentInfo: EditComment) {
        return await this.commentsService.editComment(req.user, commentId, commentInfo);
    }
}
