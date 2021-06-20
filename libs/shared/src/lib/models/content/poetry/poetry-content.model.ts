import { ContentModel } from '../content.model';
import { SectionInfo } from '../section-info.model';
import { WorkKind } from '../work-kind.enum';
import { Genres } from '../genres.enum';
import { ContentRating } from '../content-rating.enum';
import { WorkStatus } from '../work-status.enum';
import { PoetryForm } from './poetry-form.enum';

export interface PoetryContent extends ContentModel {
    sections?: string[] | SectionInfo[];
    meta: {
        category: WorkKind;
        form: PoetryForm;
        collection: boolean;
        genres: Genres[];
        rating: ContentRating;
        status: WorkStatus;
        warnings: string[];
        coverArt?: string;
    };
}
