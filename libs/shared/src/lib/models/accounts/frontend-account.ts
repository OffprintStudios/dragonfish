import { Pseudonym } from '@dragonfish/shared/models/accounts/psuedonyms';
import { Roles } from '@dragonfish/shared/models/accounts/audit';

export interface FrontendAccount {
    readonly _id: string;
    pseudonyms: Pseudonym[];
    roles: Roles[];
    termsAgree: boolean;
    emailConfirmed: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
