import { ContentModel } from '../content';
import { RatingOption } from './rating-option.enum';

export interface ReadingHistory {
    readonly _id: string;
    readonly owner: string;
    readonly content: string | ContentModel;
    readonly viewedOn: Date;
    sectionsRead: string[];
    ratingOption: RatingOption;
    visible: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
