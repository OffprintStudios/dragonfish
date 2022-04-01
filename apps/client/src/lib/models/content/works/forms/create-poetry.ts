import type { WorkKind } from '../work-kind';
import type { PoetryFormKind } from '../poetry-form-kind';
import type { Genres } from '../genres';
import type { ContentRating } from '$lib/models/content';
import type { WorkStatus } from '../work-status';

export interface CreatePoetry {
    readonly title: string;
    readonly desc: string;
    readonly body: string;
    readonly category: WorkKind;
    readonly form: PoetryFormKind;
    readonly genres: Genres[];
    readonly tags: string[];
    readonly rating: ContentRating;
    readonly status: WorkStatus;
}
