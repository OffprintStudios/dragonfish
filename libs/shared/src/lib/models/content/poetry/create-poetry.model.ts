import { WorkKind } from '../work-kind.enum';
import { PoetryForm } from './poetry-form.enum';
import { Genres } from '../genres.enum';
import { ContentRating } from '../content-rating.enum';
import { WorkStatus } from '../work-status.enum';

export interface CreatePoetry {
    readonly title: string;
    readonly desc: string;
    readonly body: string;
    readonly category: WorkKind;
    readonly collection: boolean;
    readonly form: PoetryForm;
    readonly fandoms: {
        readonly parentId: string,
        readonly childId: string | null,
    }[] | null;
    readonly genres: Genres[];
    readonly rating: ContentRating;
    readonly status: WorkStatus;
}
