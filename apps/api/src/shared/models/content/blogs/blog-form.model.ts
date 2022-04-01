import { ContentRating } from '../content-rating.enum';

export interface BlogForm {
    readonly title: string;
    readonly desc?: string;
    readonly body: string;
    readonly rating: ContentRating;
    readonly releaseOn?: Date;
}
