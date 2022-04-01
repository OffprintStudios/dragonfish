import { Roles } from './roles';
import { Pseudonym } from './pseudonym';
import { SessionInfo } from './session-info';

export interface Account {
    readonly _id: string;
    email: string;
    password: string;
    pseudonyms: string[] | Pseudonym[];
    roles: Roles[];
    sessions: SessionInfo[];
    termsAgree: boolean;
    emailConfirmed: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
