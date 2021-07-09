import { PaginateResult } from 'mongoose';

import { JwtPayload } from '@dragonfish/shared/models/auth';
import { ContentComment, CommentForm } from '@dragonfish/shared/models/comments';

export interface IComments {
    /**
     * Grabs the comments belonging to this content.
     *
     * @param contentId The content that these comments belong to
     * @param pageNum The current page
     */
    get(contentId: string, pageNum: number): Promise<PaginateResult<ContentComment>>;

    /**
     * Creates a new comment that belongs to some content.
     *
     * @param user A user's JWT payload
     * @param contentId The content the comment belongs to
     * @param commentInfo The comment's info
     */
    create(user: JwtPayload, contentId: string, commentInfo: CommentForm): Promise<ContentComment>;

    /**
     * Edits a comment belonging to a user, given its ID.
     *
     * @param user The owner of the comment
     * @param commentId The comment's ID
     * @param commentInfo The comment's new info
     */
    edit(user: JwtPayload, commentId: string, commentInfo: CommentForm): Promise<void>;
}
