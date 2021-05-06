import { ReadingHistory } from '@dragonfish/shared/models/reading-history';

export interface HistoryStateModel {
    history: ReadingHistory[];
    selectedDocs: string[];
    loading: boolean;
}
