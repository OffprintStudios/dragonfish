import { Categories } from './categories.enum';
import { Fandoms } from './fandoms.enum';
import { Genres } from './genres.enum';
import { ContentRating } from './content-rating.enum';
import { WorkStatus } from './work-status.enum';

export interface EditWork {
    readonly _id: string;
    readonly title: string;
    readonly shortDesc: string;
    readonly longDesc: string;
    readonly category: Categories;
    readonly fandoms?: Fandoms[];
    readonly genres: Genres[];
    readonly rating: ContentRating,
    readonly status: WorkStatus,
}