import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { UserBlogsState } from './user-blogs.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'comments', idKey: '_id' })
export class UserBlogsStore extends EntityStore<UserBlogsState> {
    constructor() {
        super({ currPage: 1, totalBlogs: 0, perPage: 15, totalPages: 1 });
    }
}
