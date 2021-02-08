import { Controller, UseGuards, Request, Param, Body, Get, Put, Patch, Post, Inject } from '@nestjs/common';

import { Roles } from '@dragonfish/models/users';
import { RolesGuard } from '../../guards';
import { CreateComment, EditComment } from '@dragonfish/models/comments';
import { IComments } from '../../shared/content';

@Controller('comments')
export class CommentsController {
    constructor(@Inject('IComments') private readonly comments: IComments) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Put('add-content-comment/:contentId')
    async addContentComment(
        @Request() req: any,
        @Param('contentId') contentId: string,
        @Body() commentInfo: CreateComment,
    ) {
        return await this.comments.create(req.user, contentId, commentInfo);
    }

    @Get('get-content-comments/:contentId/:pageNum')
    async getContentComments(@Param('contentId') contentId: string, @Param('pageNum') pageNum: number) {
        return await this.comments.get(contentId, pageNum);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-comment/:commentId')
    async editComment(@Request() req: any, @Param('commentId') commentId: string, @Body() commentInfo: EditComment) {
        return await this.comments.edit(req.user, commentId, commentInfo);
    }
}