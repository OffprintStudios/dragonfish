import { Categories } from './categories.enum';
import { Genres } from './genres.enum';
import { ContentRating } from './content-rating.enum';
import { WorkStatus } from './work-status.enum';

export interface CreateWork {
    readonly title: string;
    readonly shortDesc: string;
    readonly longDesc: string;
    readonly category: Categories;
    readonly genres: Genres[];
    readonly rating: ContentRating;
    readonly status: WorkStatus;

    /**
     * Determines whether or not the long description uses the new editor or not.
     * Has no bearing on sections.
     * Remove this once we've migrated fully away from Quill.
     */
    readonly usesNewEditor: boolean;
}
