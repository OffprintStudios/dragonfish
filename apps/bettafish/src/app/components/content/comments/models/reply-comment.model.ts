import { UserInfoComments } from '@dragonfish/shared/models/comments';

export interface ReplyCommentModel {
    quoteUser: UserInfoComments,
    commentId: string,
    commentBody: string,
}
