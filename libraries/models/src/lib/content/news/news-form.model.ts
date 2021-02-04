import { NewsCategory } from './news-category.enum';

export interface NewsForm {
    readonly title: string;
    readonly desc: string;
    readonly category: NewsCategory;
    readonly body: string;
}