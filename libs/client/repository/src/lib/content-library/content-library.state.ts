import { ActiveState, EntityState } from '@datorama/akita';
import { ContentLibrary } from '@dragonfish/shared/models/users/content-library';

export interface ContentLibraryState extends EntityState<ContentLibrary, string>, ActiveState {}
