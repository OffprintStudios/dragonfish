import { ContentModel } from '../../content';
import { Pseudonym } from '../../accounts';

export interface ContentCommentJob {
    commentId: string;
    content: ContentModel;
    poster: Pseudonym;
}
