import { AuditSession } from './audit-session.model';
import { Roles } from './roles.enum';

export interface User {
    readonly _id: string;
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly profile: {
        readonly avatar: string;
        readonly bio: string | null;
        readonly tagline: string | null;
        readonly coverPic: string | null;
    };
    readonly stats: {
        readonly works: number;
        readonly blogs: number;
        readonly watchers: number;
        readonly watching: number;
    };
    readonly audit: {
        readonly roles: Roles[];
        readonly sessions: AuditSession[];
        readonly termsAgree: boolean;
        readonly emailConfirmed: boolean;
        readonly deleted: boolean;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
