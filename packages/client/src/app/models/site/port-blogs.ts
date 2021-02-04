import { PaginateResult } from '@dragonfish/models/util';
import { Blog } from '@dragonfish/models/blogs';

export interface PortBlogs {
    blogs: PaginateResult<Blog>;
    userBlogs: PaginateResult<Blog>;
}
