import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CommentsState } from './comments.state';
import { CommentsStore } from './comments.store';

@Injectable({ providedIn: 'root' })
export class CommentsQuery extends QueryEntity<CommentsState> {
    public currPage$ = this.selectAll();

    constructor(protected store: CommentsStore) {
        super(store);
    }

    public get currPage() {
        return this.getValue().currPage;
    }

    public get totalComments() {
        return this.getValue().totalComments;
    }

    public get totalPages() {
        return this.getValue().totalPages;
    }

    public get perPage() {
        return this.getValue().perPage;
    }

    public get prevPage() {
        return this.getValue().currPage - 1;
    }

    public get nextPage() {
        return this.getValue().currPage + 1;
    }
}
