import type { Pronouns } from './pronouns';
import type { Presence } from './presence';
import type { Roles } from './roles';

export interface Profile {
    readonly _id: string;
    userTag: string;
    screenName: string;
    profile: {
        avatar: string;
        bio: string;
        tagline: string;
        coverPic: string;
        pronouns: Pronouns[];
    };
    stats: {
        works: number;
        blogs: number;
        followers: number;
        following: number;
    };
    presence: Presence;
    roles: Roles[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
