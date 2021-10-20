import { Pseudonym } from '@dragonfish/shared/models/accounts';

export interface ContentCommentPayload {
    readonly contentId: string;
    readonly commentId: string;
    readonly poster: Pseudonym;
}
