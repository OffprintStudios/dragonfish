import { EntityState, ActiveState } from '@datorama/akita';
import { CaseFile } from '@dragonfish/shared/models/case-files';

export interface CaseFilesState extends EntityState<CaseFile, number>, ActiveState {}
