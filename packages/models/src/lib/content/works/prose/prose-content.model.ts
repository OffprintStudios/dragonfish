import { ContentRating } from '../../content-rating.enum';
import { Genres } from '../genres.enum';
import { WorkContent } from '../work-content.model';
import { WorkKind } from '../work-kind.enum';
import { WorkStatus } from '../work-status.enum';

export interface ProseContent extends WorkContent {
    meta: {
        type: WorkKind;
        fandoms?: string[];
        genres: Genres[];
        rating: ContentRating;
        status: WorkStatus;
        warnings: string[];
        coverArt?: string;
    }
}