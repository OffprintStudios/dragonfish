import { ActionType } from '../case-files';
import { CommentHistory } from './comment-history.model';
import { CommentKind } from './comment-kind.enum';
import { Pseudonym } from '../accounts';

export interface Comment {
    readonly _id: string;
    readonly user: string | Pseudonym;
    body: string;
    repliesTo: string[];
    history: CommentHistory[];
    audit: {
        isActioned: boolean;
        canEdit: boolean;
        action: ActionType;
        actionReason: string;
        actionedBy: string | Pseudonym;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly kind: CommentKind;
}
