import { Section } from '@dragonfish/shared/models/sections';
import { ActiveState, EntityState } from '@datorama/akita';

export interface SectionsState extends EntityState<Section, string>, ActiveState {
    pubSecList: Section[];
}
