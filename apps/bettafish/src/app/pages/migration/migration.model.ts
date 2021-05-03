import { Work } from '@dragonfish/shared/models/works';
import { Blog } from '@dragonfish/shared/models/blogs';

export interface MigrationModel {
    works: Work[],
    blogs: Blog[],
}
