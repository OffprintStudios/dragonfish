import { ActiveState, EntityState } from '@datorama/akita';
import { TagsModel } from '@dragonfish/shared/models/content';

export interface TagsState extends EntityState<TagsModel, string>, ActiveState {}
