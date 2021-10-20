import { ContentKind } from '@dragonfish/shared/models/content';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

export interface ContentCommentJob {
    recipientId: string;
    commentId: string;
    contentId: string;
    contentTitle: string;
    contentKind: ContentKind;
    poster: Pseudonym;
}
