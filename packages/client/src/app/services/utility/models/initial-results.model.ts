import { Blog } from '@pulp-fiction/models/blogs';
import { User } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';
import { Work } from '@pulp-fiction/models/works';

export interface InitialResults {
    users: PaginateResult<User>,
    blogs: PaginateResult<Blog>,
    works: PaginateResult<Work>
}