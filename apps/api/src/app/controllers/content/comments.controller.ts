import { Controller, UseGuards, Param, Body, Get, Put, Patch, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Roles } from '@dragonfish/shared/models/users';
import { RolesGuard } from '../../guards';
import { CreateComment, EditComment } from '@dragonfish/shared/models/comments';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { IComments } from '../../shared/content';
import { User } from '@dragonfish/api/utilities/decorators';

@Controller('comments')
export class CommentsController {
    constructor(@Inject('IComments') private readonly comments: IComments) {}

    @ApiTags(DragonfishTags.Comments)
    @UseGuards(RolesGuard([Roles.User]))
    @Put('add-content-comment/:contentId')
    async addContentComment(
        @User() user: JwtPayload,
        @Param('contentId') contentId: string,
        @Body() commentInfo: CreateComment
    ) {
        return await this.comments.create(user, contentId, commentInfo);
    }

    @ApiTags(DragonfishTags.Comments)
    @Get('get-content-comments/:contentId/:pageNum')
    async getContentComments(@Param('contentId') contentId: string, @Param('pageNum') pageNum: number) {
        return await this.comments.get(contentId, pageNum);
    }

    @ApiTags(DragonfishTags.Comments)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-comment/:commentId')
    async editComment(
        @User() user: JwtPayload,
        @Param('commentId') commentId: string,
        @Body() commentInfo: EditComment
    ) {
        return await this.comments.edit(user, commentId, commentInfo);
    }
}
