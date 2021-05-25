import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TagsState } from './tags.state';
import { TagsStore } from './tags.store';

@Injectable({ providedIn: 'root' })
export class TagsQuery extends QueryEntity<TagsState> {
    public loading$ = this.selectLoading();
    public all$ = this.selectAll();
    public current$ = this.selectActive();

    constructor(protected store: TagsStore) {
        super(store);
    }

    public get currentId() {
        return this.getActive()._id;
    }
}
