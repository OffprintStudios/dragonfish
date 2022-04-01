import type { Content } from '../content';
import type { Section } from './section';
import type { ContentRating } from '../content-rating';
import type { WorkStatus } from './work-status';
import type { Genres } from './genres';
import type { WorkKind } from './work-kind';

export interface Prose extends Content {
	sections: Section[];
	meta: {
		category: WorkKind;
		genres: Genres[];
		rating: ContentRating;
		warnings: string[];
		status: WorkStatus;
		coverArt?: string;
	};
}
