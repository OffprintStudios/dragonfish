export type { ContentCommentJob } from './content-comment.job';
export type { CommentReplyJob, CommentReplyDBJob } from './comment-reply.job';
export type { AddedToLibraryJob } from './added-to-library.job';
export type { ContentUpdatedJob } from './content-updated.job';
export type { NewMessageJob } from './new-message.job';

import { ContentCommentJob } from './content-comment.job';
import { CommentReplyDBJob, CommentReplyJob } from './comment-reply.job';
import { AddedToLibraryJob } from './added-to-library.job';
import { ContentUpdatedJob } from './content-updated.job';
import { NewMessageJob } from './new-message.job';

export type JobType =
    | ContentCommentJob
    | AddedToLibraryJob
    | ContentUpdatedJob
    | CommentReplyJob
    | CommentReplyDBJob
    | NewMessageJob;
