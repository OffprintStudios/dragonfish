import { ActiveState, EntityState } from '@datorama/akita';
import { TagsTree } from '@dragonfish/shared/models/content/tags.model';

export interface TagsState extends EntityState<TagsTree, string>, ActiveState {}
