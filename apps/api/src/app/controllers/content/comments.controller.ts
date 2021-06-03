import { Controller, UseGuards, Body, Put, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@dragonfish/shared/models/users';
import { RolesGuard } from '../../guards';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { User } from '@dragonfish/api/utilities/decorators';
import { CommentStore } from '@dragonfish/api/database/comments/stores';
import { CommentForm, CommentKind } from '@dragonfish/shared/models/comments';

@ApiTags(DragonfishTags.Comments)
@UseGuards(RolesGuard([Roles.User]))
@Controller('comments')
export class CommentsController {
    constructor(private readonly comments: CommentStore) {}

    @Put('add-comment')
    async addComment(@User() user: JwtPayload, @Query('itemId') itemId: string, @Query('kind') kind: CommentKind, @Body() form: CommentForm) {
        return await this.comments.create(user, itemId, kind, form);
    }

    @Patch('edit-comment')
    async editComment(@User() user: JwtPayload, @Query('id') id: string, @Body() form: CommentForm) {
        return await this.comments.edit(user, id, form);
    }
}
