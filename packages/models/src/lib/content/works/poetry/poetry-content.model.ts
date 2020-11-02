import { ContentRating } from '../../content-rating.enum';
import { Genres } from '../genres.enum';
import { WorkContent } from '../work-content.model';
import { WorkKind } from '../work-kind.enum';
import { WorkStatus } from '../work-status.enum';
import { PoetryForm } from './poetry-form.enum';

export interface PoetryContent extends WorkContent {
    meta: {
        type: WorkKind;
        form: PoetryForm;
        fandoms?: string[];
        genres: Genres[];
        rating: ContentRating;
        status: WorkStatus;
        warnings: string[];
        coverArt?: string;
    }
}