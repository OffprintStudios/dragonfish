import type { Content } from '$lib/models/content';

export interface ShelfItem {
    readonly _id: string;
    readonly shelfId: string;
    readonly content: Content;
    readonly createdAt: Date;
}
