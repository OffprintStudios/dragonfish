import { ActiveState, EntityState } from '@datorama/akita';
import { ContentModel } from '@dragonfish/shared/models/content';

export enum FilterOptions {
    All,
    Published,
    Unpublished,
    NewestFirst,
    OldestFirst,
}

export interface MyStuffState extends EntityState<ContentModel, string>, ActiveState {
    filter: FilterOptions;
}
