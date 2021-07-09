import { FrontendUser } from '@dragonfish/shared/models/users';

export interface ReplyCommentModel {
    quoteUser: FrontendUser;
    commentId: string;
    commentBody: string;
}
