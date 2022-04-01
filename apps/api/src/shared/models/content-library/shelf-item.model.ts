import { ContentModel } from '../content';

export interface ShelfItem {
    readonly _id: string;
    readonly shelfId: string;
    readonly content: string | ContentModel;
    readonly createdAt: Date;
}
