import { ActiveState, EntityState } from '@datorama/akita';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

export interface PseudonymsState extends EntityState<Pseudonym, string>, ActiveState {}
