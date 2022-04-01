import type { Pseudonym } from '$shared/models/accounts';

export interface CommentReplyPayload {
    readonly threadId: string;
    readonly threadTitle: string;
    readonly commentId: string;
    readonly repliesTo: string[];
    readonly poster: Pseudonym;
}
