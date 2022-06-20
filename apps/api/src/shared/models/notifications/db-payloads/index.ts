import type { ContentCommentDbPayload } from './content-comment.db-payload';
import type { CommentReplyDbPayload } from './comment-reply.db-payload';
import type { AddedToLibraryDbPayload } from './added-to-library.db-payload';
import type { NewMessageDbPayload } from './new-message.db-payload';

export type { ContentCommentDbPayload } from './content-comment.db-payload';
export type { CommentReplyDbPayload } from './comment-reply.db-payload';
export type { AddedToLibraryDbPayload } from './added-to-library.db-payload';
export type { NewMessageDbPayload } from './new-message.db-payload';

export type DbPayloads =
    | ContentCommentDbPayload
    | CommentReplyDbPayload
    | AddedToLibraryDbPayload
    | NewMessageDbPayload;
