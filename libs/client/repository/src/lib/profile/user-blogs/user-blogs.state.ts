import { EntityState } from '@datorama/akita';
import { BlogsContentModel } from '@dragonfish/shared/models/content';

export interface UserBlogsState extends EntityState<BlogsContentModel, string> {
    currPage: number;
    totalBlogs: number;
    perPage: number;
    totalPages: number;
}
