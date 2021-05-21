import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { SectionsState } from './sections.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'my-stuff', idKey: '_id', cache: { ttl: 3600000 } })
export class SectionsStore extends EntityStore<SectionsState> {
    constructor() {
        super();
    }
}
