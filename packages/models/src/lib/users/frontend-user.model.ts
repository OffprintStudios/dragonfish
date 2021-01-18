import { Roles } from './roles.enum';
import { Themes } from './theme';

export interface FrontendUser {
    readonly _id: string;
    readonly email: string;
    readonly username: string;
    readonly agreedToPolicies: boolean;
    readonly profile: {
        readonly avatar: string;
        readonly themePref: Themes.Preference;
        readonly bio: string | null;
        readonly tagline: string | null;
    };
    readonly stats: {
        readonly works: number;
        readonly blogs: number;
        readonly watchers: number;
        readonly watching: number;
    };
    readonly roles: Roles[];
    readonly createdAt: Date;
    readonly token?: string;
}