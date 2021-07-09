import { RatingOption } from '@dragonfish/shared/models/reading-history';

export interface RatingsModel {
    readonly contentId: string;
    readonly userId: string;
    rating: RatingOption;
    readonly createdAt: Date;
}
