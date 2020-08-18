import { Work } from '../works';
import { RatingOption } from './rating-option.enum';

export interface History {
    readonly _id: string;
    readonly owner: string;
    readonly items: HistoryItem[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface HistoryItem {
    readonly _id: string;
    readonly work: Work;
    readonly ratingStatus: RatingOption;
    readonly visible: boolean;
    readonly finishedReading: boolean;
    readonly finishedOn: Date;
    readonly viewedOn: Date;
}