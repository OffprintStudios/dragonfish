import { Roles } from '../users';
import { NewsCategory } from './news-category.enum';

export interface NewsPost {
    readonly _id: string;
    readonly user: string | PostUser;
    title: string;
    desc: string;
    body: string;
    category: NewsCategory;
    stats: PostStats;
    audit: PostAudit;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface PostUser {
    readonly _id: string;
    readonly username: string;
    readonly profile: {
        readonly avatar: string;
    };
    readonly audit: {
        readonly roles: Roles;
    };
}

export interface PostStats {
    likes: number;
    dislikes: number;
    comments: number;
    words: number;
}

export interface PostAudit {
    featured: boolean;
    published: boolean;
    publishedOn?: Date;
    isDeleted: boolean;
}