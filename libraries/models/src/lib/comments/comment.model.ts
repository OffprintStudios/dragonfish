import { Roles } from '../users';
import { ContentAction } from './content-action.enum';

export interface Comment {
    readonly _id: string;
    readonly user: string | UserInfoComments;
    body: string;
    readonly replies: string[];
    readonly stats: {
        readonly likes: number;
        readonly dislikes: number;
    };
    readonly history: CommentHistory[];
    readonly audit: {
        readonly isActioned: boolean;
        readonly canEdit: boolean;
        readonly action: ContentAction;
        readonly actionReason: string;
        readonly actionedBy: string | ModInfo;
    };
    isEditing: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly kind: string;
}

export interface CommentHistory {
    readonly oldBody: string;
    readonly editedOn: Date;
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

export interface ModInfo {
    readonly _id: string;
    readonly username: string;
    readonly audit: {
        readonly roles: Roles[];
    };
}

export interface BlogComment extends Comment {
    readonly blogId: string;
}

export interface WorkComment extends Comment {
    readonly workId: string;
}

export interface ContentComment extends Comment {
    readonly contentId: string;
}