import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { SectionsState } from './sections.state';
import { SectionsStore } from './sections.store';
import { Section } from '@dragonfish/shared/models/sections';

@Injectable({ providedIn: 'root' })
export class SectionsQuery extends QueryEntity<SectionsState> {
    public loading$ = this.selectLoading();
    public all$ = this.selectAll();
    public current$ = this.selectActive<Section>();

    constructor(protected store: SectionsStore) {
        super(store);
    }

    public get currentId() {
        return this.getActive()._id;
    }

    public get numSections() {
        return this.getCount();
    }

    public get pubSections() {
        return this.getAll().filter((item) => {
            return item.published === true;
        });
    }

    public get currIndex() {
        return this.getValue().currIndex;
    }

    public get lastPage() {
        return this.getValue().currIndex - 1;
    }

    public get nextPage() {
        return this.getValue().currIndex + 1;
    }
}
