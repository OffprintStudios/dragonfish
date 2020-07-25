import { Categories } from './categories.enum';
import { Fandoms } from './fandoms.enum';
import { GenresFiction, GenresPoetry } from './genres.enum';
import { ContentRating } from './content-rating.enum';
import { WorkStatus } from './work-status.enum';

export interface CreateWork {
    readonly title: string;
    readonly shortDesc: string;
    readonly longDesc: string;
    readonly category: Categories;
    readonly fandoms?: Fandoms[];
    readonly genres: GenresFiction[] | GenresPoetry[];
    readonly rating: ContentRating,
    readonly status: WorkStatus,
}