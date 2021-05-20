import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { FilterOptions, MyStuffState } from './my-stuff.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'my-stuff', idKey: '_id', cache: { ttl: 3600000 } })
export class MyStuffStore extends EntityStore<MyStuffState> {
    constructor() {
        super({ filter: FilterOptions.All });
    }
}
