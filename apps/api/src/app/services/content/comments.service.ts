import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';

import { CommentsStore } from '../../db/comments/comments.store';
import { IComments } from '../../shared/content';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { ContentComment, CreateComment, EditComment } from '@dragonfish/shared/models/comments';

@Injectable()
export class CommentsService implements IComments {
    constructor(private readonly comments: CommentsStore) {}

    async get(contentId: string, pageNum: number): Promise<PaginateResult<ContentComment>> {
        return await this.comments.getContentComments(contentId, pageNum);
    }

    async create(user: JwtPayload, contentId: string, commentInfo: CreateComment): Promise<ContentComment> {
        return await this.comments.createContentComment(user, contentId, commentInfo);
    }

    async edit(user: JwtPayload, commentId: string, commentInfo: EditComment): Promise<void> {
        return await this.comments.editComment(user, commentId, commentInfo);
    }
}
