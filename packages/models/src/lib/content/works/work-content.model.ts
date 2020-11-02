import { ContentModel } from '../content.model';
import { ContentRating } from '../content-rating.enum';
import { SectionInfo } from './section-info.model';
import { WorkKind } from './work-kind.enum';
import { Genres } from './genres.enum';
import { WorkStatus } from './work-status.enum';

export interface WorkContent extends ContentModel {
    sections?: SectionInfo[];
    meta: {
        type: WorkKind;
        genres: Genres[]
        rating: ContentRating;
        warnings: string[];
        status: WorkStatus;
        coverArt?: string;
    }
}