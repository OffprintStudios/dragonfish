import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserBlogsState } from './user-blogs.state';
import { UserBlogsStore } from './user-blogs.store';

@Injectable({ providedIn: 'root' })
export class UserBlogsQuery extends QueryEntity<UserBlogsState> {
    public currPage$ = this.selectAll();

    constructor(protected store: UserBlogsStore) {
        super(store);
    }

    public get currPage() {
        return this.getValue().currPage;
    }

    public get totalBlogs() {
        return this.getValue().totalBlogs;
    }

    public get totalPages() {
        return this.getValue().totalPages;
    }

    public get perPage() {
        return this.getValue().perPage;
    }
}
