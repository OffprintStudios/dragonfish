import type { RatingOption } from './rating-option';

export interface Ratings {
	readonly contentId: string;
	readonly userId: string;
	rating: RatingOption;
	readonly createdAt: Date;
}
