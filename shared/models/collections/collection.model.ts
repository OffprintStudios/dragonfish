import { AuthorInfo } from '../works';
import { WorkMetadata } from '../works';

export interface Collection {
    readonly _id: string;
    readonly user: string;
    readonly name: string;
    readonly desc: string;
    readonly details: Details[];
    readonly audit: {
        readonly isPublic: boolean;
        readonly isDeleted: boolean;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

/* Helpers for building queries */
export interface WorkInfo {
    readonly _id: string;
    readonly author: AuthorInfo;
    readonly title: string;
    readonly shortDesc: string;
    readonly meta: WorkMetadata;
    readonly stats: {
        readonly totWords: number;
        readonly likes: number;
        readonly dislikes: number;
        readonly views: number;
        readonly comments: number;
    };
    readonly createdAt: Date;
}

export interface Details {
    readonly work: WorkInfo;
    readonly addedOn: Date;
}