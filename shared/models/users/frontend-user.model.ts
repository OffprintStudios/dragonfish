export interface FrontendUser {
    readonly _id: string;
    readonly email: string;
    readonly username: string;
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
    readonly roles: string[];
    readonly createdAt: Date;
    readonly token?: string;
}