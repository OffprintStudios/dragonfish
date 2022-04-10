import type { CommentHistory } from './comment-history';
import type { CommentKind } from './comment-kind';
import type { Profile } from '../accounts';

export interface Comment {
    readonly _id: string;
    user: Profile;
    body: string;
    repliesTo: string[];
    history: CommentHistory[];
    audit: {
        isActioned: boolean;
        canEdit: boolean;
        // action: ActionType;
        actionReason: string;
        actionedBy: Profile;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly kind: CommentKind;
}
