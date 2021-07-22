import { Roles } from './roles.enum';
import { Presence } from './presence.enum';

export interface FrontendUser {
    readonly _id: string;
    readonly username: string;
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
        readonly presence: Presence;
    };
    readonly createdAt: Date;
    readonly token?: string;
}
