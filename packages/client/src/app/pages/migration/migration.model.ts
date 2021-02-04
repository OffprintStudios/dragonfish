import { Work } from '@dragonfish/models/works';
import { Blog } from '@dragonfish/models/blogs';

export interface MigrationModel {
    works: Work[],
    blogs: Blog[]
}