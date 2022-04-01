import { Pseudonym } from '../../accounts';

export interface CommentReplyJob {
    recipients: string[];
    commentId: string;
    threadId: string;
    threadTitle: string;
    poster: Pseudonym;
}

export interface CommentReplyDBJob {
    recipientId: string;
    commentId: string;
    threadId: string;
    threadTitle: string;
    poster: Pseudonym;
}
