import { Blog } from '@pulp-fiction/models/blogs';
import { User } from '@pulp-fiction/models/users';
import { Work } from '@pulp-fiction/models/works';

export interface InitialResults {
    users: User[],
    blogs: Blog[],
    works: Work[]
}