import { ContentModel } from '../content';

export interface Collection {
    readonly _id: string;
    readonly owner: string;
    name: string;
    desc: string;
    contains: string[] | ContentModel[];
    audit: {
        isPublic: boolean;
        readonly isDeleted: boolean;
    };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
