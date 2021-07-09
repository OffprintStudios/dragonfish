import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { SectionsState } from './sections.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'sections-stuff', idKey: '_id' })
export class SectionsStore extends EntityStore<SectionsState> {
    constructor() {
        super();
    }
}
