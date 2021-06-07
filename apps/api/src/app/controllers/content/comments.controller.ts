import { Controller, UseGuards, Body, Put, Patch, Query, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@dragonfish/shared/models/users';
import { RolesGuard } from '@dragonfish/api/utilities/guards';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { User } from '@dragonfish/api/utilities/decorators';
import { CommentStore } from '@dragonfish/api/database/comments/stores';
import { CommentForm, CommentKind } from '@dragonfish/shared/models/comments';

@ApiTags(DragonfishTags.Comments)
@Controller('comments')
export class CommentsController {
    constructor(private readonly comments: CommentStore) {}

    @Get('fetch-comments')
    async fetchComments(
        @Query('itemId') itemId: string,
        @Query('kind') kind: CommentKind,
        @Query('page') page: number,
    ) {
        return await this.comments.fetch(itemId, kind, page);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Put('add-comment')
    async addComment(
        @User() user: JwtPayload,
        @Query('itemId') itemId: string,
        @Query('kind') kind: CommentKind,
        @Body() form: CommentForm,
    ) {
        return await this.comments.create(user, itemId, kind, form);
    }

    @UseGuards(RolesGuard([Roles.User]))
    @Patch('edit-comment')
    async editComment(@User() user: JwtPayload, @Query('id') id: string, @Body() form: CommentForm) {
        return await this.comments.edit(user, id, form);
    }
}
