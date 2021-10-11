import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { UserWorksState } from './user-works.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-works', idKey: '_id' })
export class UserWorksStore extends EntityStore<UserWorksState> {
    constructor() {
        super({ currPage: 1, totalWorks: 0, perPage: 15, totalPages: 1 });
    }
}
