import type { Comment } from './comment';

export interface ContentComment extends Comment {
    readonly contentId: string;
}
