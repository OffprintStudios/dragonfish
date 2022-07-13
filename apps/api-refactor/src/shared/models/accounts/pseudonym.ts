import { Pronouns } from './pronouns';
import { Presence } from './presence';

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
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
