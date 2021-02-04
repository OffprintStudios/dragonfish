import { Roles } from '../users';

export interface MessageThreadUser {
    readonly _id: string;
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
    };
    readonly audit: {
        readonly roles: Roles[];
    };
}