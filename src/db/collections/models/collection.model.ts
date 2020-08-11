import { Document } from 'mongoose';

import { AuthorInfo } from 'src/db/works/models';

export interface Collection extends Document {
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
    readonly author: string | AuthorInfo;
    readonly title: string;
    readonly shortDesc: string;
    readonly stats: {
        readonly totWords: number;
    };
}

export interface Details {
    readonly work: string | WorkInfo;
    readonly addedOn: Date;
}