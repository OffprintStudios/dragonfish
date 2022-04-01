import { ContentKind } from '../../content';
import { Pseudonym } from '../../accounts';

export interface ContentCommentJob {
    recipientId: string;
    commentId: string;
    contentId: string;
    contentTitle: string;
    contentKind: ContentKind;
    poster: Pseudonym;
}
