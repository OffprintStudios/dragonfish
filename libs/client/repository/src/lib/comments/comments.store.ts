import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { CommentsState } from './comments.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'comments', idKey: '_id' })
export class CommentsStore extends EntityStore<CommentsState> {
    constructor() {
        super({ currPage: 1, totalComments: 0, perPage: 50, totalPages: 1 });
    }
}
