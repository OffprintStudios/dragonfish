import { ContentKind } from '../content';

export interface CommentNotificationInfo {
    commenterName: string;
    commenterId: string;
    parentKind: ContentKind;
    parentId: string,    
    parentTitle: string;
}