import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { ApprovalQueueState, createInitialState } from './approval-queue.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'approval-queue' })
export class ApprovalQueueStore extends Store<ApprovalQueueState> {
    constructor() {
        super(createInitialState());
    }
}
