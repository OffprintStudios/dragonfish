import { Comment } from './comment.model';

export interface ContentComment extends Comment {
    readonly contentId: string;
}
