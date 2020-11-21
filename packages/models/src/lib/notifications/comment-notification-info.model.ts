import { ContentKind } from '../content';

export interface CommentNotificationInfo {
    commentId: string;
    commenterName: string;
    commenterId: string;
    parentKind: ContentKind;    
    parentTitle: string;
}