import { ContentModel } from '../content';

export interface ReadingHistory {
    readonly _id: string;
    readonly owner: string;
    readonly content: string | ContentModel;
    readonly viewedOn: Date;
    sectionsRead: string[];
    visible: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
