import { PaginateResult } from '@dragonfish/shared/models/util';
import { Blog } from '@dragonfish/shared/models/blogs';

export interface PortBlogs {
    blogs: PaginateResult<Blog>;
    userBlogs: PaginateResult<Blog>;
}
