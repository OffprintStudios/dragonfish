import type { Profile } from './profile';
import type { Roles } from './roles';

export interface Account {
    readonly _id: string;
    pseudonyms: Profile[];
    roles: Roles[];
    termsAgree: boolean;
    emailConfirmed: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
