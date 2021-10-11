import { EntityState } from '@datorama/akita';
import { ContentModel } from '@dragonfish/shared/models/content';

export interface UserWorksState extends EntityState<ContentModel, string> {
    currPage: number;
    totalWorks: number;
    perPage: number;
    totalPages: number;
}
