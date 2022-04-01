import { Pseudonym } from '../../accounts';

export interface ContentCommentPayload {
    readonly contentId: string;
    readonly commentId: string;
    readonly repliesTo: string[];
    readonly poster: Pseudonym;
}
