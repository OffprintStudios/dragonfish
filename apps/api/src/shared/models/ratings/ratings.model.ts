import { RatingOption } from './rating-option.enum';

export interface RatingsModel {
    readonly contentId: string;
    readonly userId: string;
    rating: RatingOption;
    readonly createdAt: Date;
}
