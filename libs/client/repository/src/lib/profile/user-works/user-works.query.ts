import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserWorksState } from './user-works.state';
import { UserWorksStore } from './user-works.store';

@Injectable({ providedIn: 'root' })
export class UserWorksQuery extends QueryEntity<UserWorksState> {
    public currPage$ = this.selectAll();

    constructor(protected store: UserWorksStore) {
        super(store);
    }

    public get currPage() {
        return this.getValue().currPage;
    }

    public get pubWorks() {
        return this.getAll().filter((item) => {
            return item.audit.published === 'Published';
        });
    }

    public get draftWorks() {
        return this.getAll().filter((item) => {
            return item.audit.published === 'Unpublished';
        });
    }

    public get pendingWorks() {
        return this.getAll().filter((item) => {
            return item.audit.published === 'Pending';
        });
    }

    public get totalWorks() {
        return this.getValue().totalWorks;
    }

    public get totalPages() {
        return this.getValue().totalPages;
    }

    public get perPage() {
        return this.getValue().perPage;
    }
}
