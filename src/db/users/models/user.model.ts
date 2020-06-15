import { Document } from 'mongoose';

export interface User extends Document {
    readonly _id: string;
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly profile: {
        readonly avatar: string;
        readonly themePref: string;
        readonly bio: string | null;
        readonly tagline: string | null;
    };
    readonly stats: {
        readonly works: number;
        readonly blogs: number;
        readonly followers: number;
        readonly following: number;
    };
    readonly audit: {
        readonly roles: string[];
        readonly sessions: string[] | null;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
