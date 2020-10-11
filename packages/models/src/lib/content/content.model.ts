import { UserInfo } from '../users';

export interface ContentModel {
    readonly _id: string;
    readonly author: string | UserInfo;
    title: string;
    desc: string;
    body: string;
    readonly stats: {
        words: number;
        readonly views: number;
        readonly likes: number;
        readonly dislikes: number;
        readonly comments: number;
    };
    audit: {
        hasComments: boolean;
        isDeleted: boolean;
    };
    readonly kind: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}