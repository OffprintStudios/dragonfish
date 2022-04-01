import { ContentModel } from '../content';

export interface ContentLibrary {
    readonly _id: string;
    readonly userId: string;
    readonly content: string | ContentModel;
    readonly createdAt: Date;
}
