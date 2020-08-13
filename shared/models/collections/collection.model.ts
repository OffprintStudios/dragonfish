import { AuthorInfo } from '../works';

export interface Collection {
    readonly _id: string;
    readonly owner: string;
    readonly name: string;
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
    readonly stats: {
        readonly totWords: number;
    };
}

export interface Details {
    readonly work: WorkInfo;
    readonly addedOn: Date;
}