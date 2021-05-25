import { ContentModel } from '../content.model';
import { SectionInfo } from '../section-info.model';
import { WorkKind } from '../work-kind.enum';
import { Genres } from '../genres.enum';
import { ContentRating } from '../content-rating.enum';
import { WorkStatus } from '../work-status.enum';
import { TagReference } from '../tag-reference.model';

export interface ProseContent extends ContentModel {
    sections: string[] | SectionInfo[];
    meta: {
        category: WorkKind;
        fandoms: TagReference[] | null;
        genres: Genres[];
        rating: ContentRating;
        warnings: string[];
        status: WorkStatus;
        coverArt?: string;
    };
}
