import { Document } from 'mongoose';

export interface Blog extends Document {
    readonly _id: string;
    readonly author: string | UserInfo;
    readonly title: string;
    readonly body: string;
    readonly published: boolean;
    readonly stats: {
        readonly comments: number;
        readonly views: number;
        readonly words: number;
        readonly likes: number;
        readonly dislikes: number;
    };
    readonly audit: {
        readonly isDeleted: boolean;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface UserInfo {
    readonly _id: string;
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
    };
}