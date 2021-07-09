import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ApprovalQueueState } from './approval-queue.state';
import { ApprovalQueueStore } from './approval-queue.store';

@Injectable({ providedIn: 'root' })
export class ApprovalQueueQuery extends Query<ApprovalQueueState> {
    public currPage$ = this.select('currPageDocs');
    public claimed$ = this.select('claimedDocs');
    public selected$ = this.select('selectedDoc');
    public selectedSections$ = this.select('selectedDocSections');
    public selectedSection$ = this.select('selectedDocSection');

    constructor(protected store: ApprovalQueueStore) {
        super(store);
    }
}
