import { Work } from '../works';
import { RatingOption } from './rating-option.enum';

export interface History {
    readonly _id: string;
    readonly owner: string;
    readonly work: string | Work;
    readonly viewedOn: Date;
    readonly sectionsRead: string[];
    ratingOption: RatingOption;
    readonly visible: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
};