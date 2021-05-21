import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Section } from '@dragonfish/shared/models/sections';
import { SectionsState } from './sections.state';
import { SectionsStore } from './sections.store';

@Injectable({ providedIn: 'root' })
export class SectionsQuery extends QueryEntity<SectionsState> {
    public loading$ = this.selectLoading();
    public all$ = this.selectAll();
    public current$ = this.selectActive<Section>();

    constructor(protected store: SectionsStore) {
        super(store);
    }
}
