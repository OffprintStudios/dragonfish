import { Controller, UseGuards, Body, Put, Patch, Query, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@dragonfish/shared/models/accounts';
import { IdentityGuard } from '../../guards';
import { DragonfishTags } from '@dragonfish/shared/models/util';
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

    @UseGuards(IdentityGuard([Roles.User]))
    @Put('add-comment')
    async addComment(
        @Query('pseudId') pseudId: string,
        @Query('itemId') itemId: string,
        @Query('kind') kind: CommentKind,
        @Body() form: CommentForm,
    ) {
        return await this.comments.create(pseudId, itemId, kind, form);
    }

    @UseGuards(IdentityGuard([Roles.User]))
    @Patch('edit-comment')
    async editComment(@Query('pseudId') pseudId: string, @Query('id') id: string, @Body() form: CommentForm) {
        return await this.comments.edit(pseudId, id, form);
    }
}
