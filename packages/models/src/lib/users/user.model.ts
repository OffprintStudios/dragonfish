import { Roles } from './roles.enum';
import { AuditSession } from './audit-session.model';

export interface User {
    readonly _id: string;
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly agreedToPolicies: boolean;
    readonly profile: {
        readonly avatar: string;
        readonly themePref: string;
        readonly bio: string | null;
        readonly tagline: string | null;
    };
    readonly stats: {
        readonly works: number;
        readonly blogs: number;
        readonly watchers: number;
        readonly watching: number;
    };
    readonly audit: {
        readonly roles: Roles[];
        readonly sessions: AuditSession[] | null;
        readonly termsAgree: boolean;
        readonly emailConfirmed: boolean;
        readonly isDeleted: boolean;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}