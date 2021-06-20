import { EntityState, MultiActiveState } from '@datorama/akita';
import { ReadingHistory } from '@dragonfish/shared/models/reading-history';

export interface ReadingHistoryState extends EntityState<ReadingHistory, string>, MultiActiveState {}
