import { CaseKind } from './case-kind.enum';
import { Report } from './reports.model';
import { Note } from './notes.model';
import { Comment } from '../comments';
import { ContentModel } from '../content';
import { ActionType } from './action.type';
import { Account, Pseudonym } from '../accounts';

export interface CaseFile {
    readonly _id: number;
    reports: Report[];
    notes: Note[];
    isClosed: boolean;
    claimedBy: string | Pseudonym;
    action: {
        hasType: ActionType;
        date: Date;
        reason: string;
    };
    readonly kind: CaseKind;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface ContentCaseFile extends CaseFile {
    content: string | ContentModel;
}

export interface CommentCaseFile extends CaseFile {
    comment: string | Comment;
}

export interface UserCaseFile extends CaseFile {
    user: string | Account;
}
