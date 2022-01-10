import { Pseudonym } from './psuedonyms';
import { Roles } from './audit';

export interface FrontendAccount {
    readonly _id: string;
    pseudonyms: Pseudonym[];
    roles: Roles[];
    termsAgree: boolean;
    emailConfirmed: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
