import { NewsCategory } from './news-category.enum';

export interface PostForm {
    readonly title: string;
    readonly desc: string;
    readonly category: NewsCategory;
    readonly body: string;
}