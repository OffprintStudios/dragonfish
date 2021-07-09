import { ActionType } from '../case-files';
import { FrontendUser } from '../users';
import { CommentHistory } from './comment-history.model';
import { CommentKind } from './comment-kind.enum';

export interface Comment {
    readonly _id: string;
    readonly user: string | FrontendUser;
    body: string;
    repliesTo: string[];
    history: CommentHistory[];
    audit: {
        isActioned: boolean;
        canEdit: boolean;
        action: ActionType;
        actionReason: string;
        actionedBy: string | FrontendUser;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly kind: CommentKind;
}
