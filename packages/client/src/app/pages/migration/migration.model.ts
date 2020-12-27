import { Work } from '@pulp-fiction/models/works';
import { Blog } from '@pulp-fiction/models/blogs';

export interface MigrationModel {
    works: Work[],
    blogs: Blog[]
}