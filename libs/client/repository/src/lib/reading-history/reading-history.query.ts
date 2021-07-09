import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ReadingHistoryState } from './reading-history.state';
import { ReadingHistoryStore } from './reading-history.store';
import { ContentModel } from '@dragonfish/shared/models/content';

@Injectable({ providedIn: 'root' })
export class ReadingHistoryQuery extends QueryEntity<ReadingHistoryState> {
    public loading$ = this.selectLoading();
    public all$ = this.selectAll();
    public current$ = this.selectActive<ContentModel>();

    constructor(protected store: ReadingHistoryStore) {
        super(store);
    }

    public get currentIds() {
        return this.getActiveId();
    }
}
