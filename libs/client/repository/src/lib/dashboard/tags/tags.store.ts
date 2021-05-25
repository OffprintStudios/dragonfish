import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { TagsState } from './tags.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tags', idKey: '_id', cache: { ttl: 3600000 } })
export class TagsStore extends EntityStore<TagsState> {
    constructor() {
        super();
    }
}
