import { WorkKind } from '../work-kind.enum';
import { Genres } from '../genres.enum';
import { ContentRating } from '../content-rating.enum';
import { WorkStatus } from '../work-status.enum';

export interface CreateProse {
    readonly title: string;
    readonly desc: string;
    readonly body: string;
    readonly category: WorkKind;
    readonly genres: Genres[];
    readonly tags: string[];
    readonly rating: ContentRating;
    readonly status: WorkStatus;
}
