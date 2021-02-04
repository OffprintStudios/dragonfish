import { Roles } from './roles.enum';

export interface UserInfo {
    readonly _id: string;
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
    };
    readonly roles: Roles[];
}