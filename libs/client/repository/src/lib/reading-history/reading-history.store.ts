import { Injectable } from '@angular/core';
import { StoreConfig, EntityStore } from '@datorama/akita';
import { ReadingHistoryState } from './reading-history.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'reading-history', idKey: '_id' })
export class ReadingHistoryStore extends EntityStore<ReadingHistoryState> {
    constructor() {
        super({ active: [] });
    }
}
