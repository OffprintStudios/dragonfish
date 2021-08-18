import { Pseudonym } from '@dragonfish/shared/models/accounts';

export interface ReplyCommentModel {
    quoteUser: Pseudonym;
    commentId: string;
    commentBody: string;
}
