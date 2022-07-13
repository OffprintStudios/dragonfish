import { Pseudonym } from './pseudonym';
import { Roles } from './roles';

export interface FrontendAccount {
    readonly _id: string;
    pseudonyms: Pseudonym[];
    roles: Roles[];
    termsAgree: boolean;
    emailConfirmed: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
