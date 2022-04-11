import { CommentReplyDBJob } from '$shared/models/notifications/jobs';

export interface CommentReplyDbPayload extends CommentReplyDBJob {
    value?: any; // temporary, just to ignore ESlint warnings
}
