import { PaginateResult } from '@pulp-fiction/models/util';
import { Blog } from '@pulp-fiction/models/blogs';

export interface PortBlogs {
    blogs: PaginateResult<Blog>;
    userBlogs: PaginateResult<Blog>;
}