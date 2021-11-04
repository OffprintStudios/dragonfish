import { ContentKind } from '../../../content';
import { Pseudonym } from '../../psuedonyms';

export interface ContentCommentJob {
    recipientId: string;
    commentId: string;
    contentId: string;
    contentTitle: string;
    contentKind: ContentKind;
    poster: Pseudonym;
}
