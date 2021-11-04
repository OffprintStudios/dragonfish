import { Pseudonym } from '../../psuedonyms';

export interface ContentCommentPayload {
    readonly contentId: string;
    readonly commentId: string;
    readonly poster: Pseudonym;
}
