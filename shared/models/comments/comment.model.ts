import { Roles } from '../users';

export interface Comment {
    readonly _id: string;
    readonly user: string | UserInfoComments;
    readonly body: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly kind: string;
}

export interface UserInfoComments {
    readonly _id: string;
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
        readonly tagline: string;
    };
    readonly audit: {
        readonly roles: Roles[]
    };
}

export interface BlogComment extends Comment {
    readonly blogId: string;
}

export interface WorkComment extends Comment {
    readonly workId: string;
}