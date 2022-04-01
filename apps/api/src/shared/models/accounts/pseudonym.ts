import { Pronouns } from './pronouns';
import { Presence } from './presence';
import { Roles } from './roles';

export interface Pseudonym {
    readonly _id: string;
    readonly accountId: string;
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
