import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { PseudonymsState } from './pseudonyms.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'my-stuff', idKey: '_id', cache: { ttl: 3600000 } })
export class PseudonymsStore extends EntityStore<PseudonymsState> {
    constructor() {
        super();
    }
}
