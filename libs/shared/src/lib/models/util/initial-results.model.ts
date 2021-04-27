import { ContentModel } from '../content';
import { User } from '../users';

export interface InitialResults {
    users: User[];
    blogs: ContentModel[];
    works: ContentModel[];
}
