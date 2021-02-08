import { Controller, UseGuards, Param, Body, Get, Put, Patch, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Roles } from '@dragonfish/models/users';
import { RolesGuard } from '../../guards';
import { CreateComment, EditComment } from '@dragonfish/models/comments';
import { JwtPayload } from '@dragonfish/models/auth';
import { IComments } from '../../shared/content';
import { User } from '../../util/decorators';

@Controller('comments')
export class CommentsController {
    constructor(@Inject('IComments') private readonly comments: IComments) {}

    @ApiTags('Comments')
    @UseGuards(RolesGuard([Roles.User]))
    @Put('add-content-comment/:contentId')
    async addContentComment(
        @User() user: JwtPayload,
        @Param('contentId') contentId: string,
        @Body() commentInfo: CreateComment,
    ) {
        return await this.comments.create(user, contentId, commentInfo);
    }

    @ApiTags('Comments')
    @Get('get-content-comments/:contentId/:pageNum')
    async getContentComments(@Param('contentId') contentId: string, @Param('pageNum') pageNum: number) {
        return await this.comments.get(contentId, pageNum);
    }

    @ApiTags('Comments')
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-comment/:commentId')
    async editComment(
        @User() user: JwtPayload,
        @Param('commentId') commentId: string,
        @Body() commentInfo: EditComment,
    ) {
        return await this.comments.edit(user, commentId, commentInfo);
    }
}
