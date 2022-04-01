import { Controller, UseGuards, Body, Put, Patch, Query, Get } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Roles } from '$shared/models/accounts';
import { IdentityGuard } from '$shared/guards';
import { Identity } from '$shared/auth';
import { CommentForm, CommentKind } from '$shared/models/comments';
import { CommentsService } from '../services';

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly comments: CommentsService,
        private readonly events: EventEmitter2,
    ) {}

    @Get('fetch-comments')
    async fetchComments(
        @Query('itemId') itemId: string,
        @Query('kind') kind: CommentKind,
        @Query('page') page: number,
    ) {
        return await this.comments.fetchComments(itemId, kind, page);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Put('add-comment')
    async addComment(
        @Query('pseudId') pseudId: string,
        @Query('itemId') itemId: string,
        @Query('kind') kind: CommentKind,
        @Body() form: CommentForm,
    ) {
        return await this.comments.createComment(pseudId, itemId, kind, form);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.User)
    @Patch('edit-comment')
    async editComment(
        @Query('pseudId') pseudId: string,
        @Query('id') id: string,
        @Body() form: CommentForm,
    ) {
        return await this.comments.editComment(pseudId, id, form);
    }
}
