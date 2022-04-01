import type { Content } from '../content';
import type { Section } from './section';
import type { ContentRating } from '../content-rating';
import type { WorkStatus } from './work-status';
import type { Genres } from './genres';
import type { WorkKind } from './work-kind';
import type { PoetryFormKind } from './poetry-form-kind';

export interface Poetry extends Content {
	sections: Section[];
	meta: {
		category: WorkKind;
		form: PoetryFormKind;
		collection: boolean;
		genres: Genres[];
		rating: ContentRating;
		status: WorkStatus;
		warnings: string[];
		coverArt?: string;
	};
}
