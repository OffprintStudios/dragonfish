import { Roles } from '../users';

export interface MessageUser {
    readonly _id: string;
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
    };
    readonly audit: {
        readonly roles: Roles[]
    };
}