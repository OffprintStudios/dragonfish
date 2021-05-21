import { ActiveState, EntityState } from '@datorama/akita';
import { Section } from '@dragonfish/shared/models/sections';

export interface SectionsState extends EntityState<Section, string>, ActiveState {}
