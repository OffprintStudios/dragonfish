import { SessionInfo, Roles } from './audit';
import { Pseudonym } from './psuedonyms';

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
