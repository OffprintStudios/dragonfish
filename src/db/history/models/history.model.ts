import { Document } from 'mongoose';

import { Work } from 'src/db/works/models';
import { RatingOption } from './rating-option.enum';

export interface History extends Document {
    readonly _id: string;
    readonly owner: string;
    readonly items: ItemInfo[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface ItemInfo {
    readonly work: Work;
    readonly viewedOn: Date;
    readonly ratingStatus: RatingOption;
    readonly visible: boolean;
}