export interface SearchUser {
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
    };
    readonly stats: {
        readonly works: number;
        readonly blogs: number;
        readonly watchers: number;
        readonly watching: number;
    };
}
