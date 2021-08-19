import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { PseudonymsState } from './pseudonyms.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'pseudonyms', idKey: '_id' })
export class PseudonymsStore extends EntityStore<PseudonymsState> {
    constructor() {
        super();
    }
}
