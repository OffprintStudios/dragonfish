import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../shared/user';
import { AQNamespace } from '../../../shared/dash/approval-queue';

import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';
import { ContentKind, ContentModel } from '@pulp-fiction/models/content';
import { Decision } from '@pulp-fiction/models/contrib';
import { FrontendUser, UserInfo } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';

@Component({
    selector: 'approval-queue',
    templateUrl: './approval-queue.component.html',
    styleUrls: ['./approval-queue.component.less']
})
export class ApprovalQueueComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    queue: PaginateResult<ApprovalQueue>;
    contentKind = ContentKind;

    pageNum = 1;

    constructor(private store: Store, public route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.queue = data.queueData as PaginateResult<ApprovalQueue>;
        });
    }

    /**
     * Handles page changing
     * 
     * @param event The new page
     */
    onPageChange(event: number) {
        this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
        this.pageNum = event;
    }

    /**
     * Goes to the appropriate content view for the following queue entry.
     * 
     * @param entry The approval queue entry
     */
    goToContentView(entry: ApprovalQueue, authorId: string) {
        this.store.dispatch(new AQNamespace.SelectWork(entry)).subscribe(() => {
            const content: ContentModel = entry.workToApprove as ContentModel;
            if (content.kind === ContentKind.ProseContent) {
                this.router.navigate(['view-prose'], {relativeTo: this.route});
            } else if (content.kind === ContentKind.PoetryContent) {
                this.router.navigate(['view-poetry'], {relativeTo: this.route});
            } else {
                this.snackBar.open(`...what's this doing here?`);
            }
        })
    }

    /**
     * Forces a refresh of the current page of the queue.
     */
    forceRefresh() {
        // eventually, none of this will be necessary and items will be updated in-place.
        this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
    }

    /**
     * Checks to see if the queue is empty.
     */
    queueIsEmpty() {
        if (this.queue.docs.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks to see if this entry has been claimed by anyone.
     * 
     * @param entry The approval queue entry
     */
    checkIfClaimed(entry: ApprovalQueue) {
        if (entry.claimedBy === null || entry.claimedBy === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Checks to see if the provided entry is claimed by the currently signed in user.
     * 
     * @param entry The approval queue entry
     */
    checkIfClaimedByThisUser(entry: ApprovalQueue) {
        if (entry.claimedBy !== null && entry.claimedBy !== undefined) {
            let whoClaimedThis = entry.claimedBy as UserInfo;
            if (whoClaimedThis._id === this.currentUser._id) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Claims an entry to the queue.
     * 
     * @param entry The approval queue entry
     */
    claimWork(entry: ApprovalQueue) {
        this.store.dispatch(new AQNamespace.ClaimWork(entry)).subscribe(() => {
            this.forceRefresh();
        });
    }

    /**
     * Approves a work.
     * 
     * @param entry The entry to approve
     * @param work The work to approve
     */
    approveWork(entry: ApprovalQueue) {
        let thisWork = entry.workToApprove as ContentModel;
        let thisWorksAuthor = thisWork.author as UserInfo;
        const decision: Decision = {
            docId: entry._id,
            workId: thisWork._id,
            authorId: thisWorksAuthor._id
        };

        this.store.dispatch(new AQNamespace.ApproveWork(decision)).subscribe(() => {
            this.forceRefresh();
        });
    }

    /**
     * Rejects a work.
     * 
     * @param entry The entry to reject
     * @param work The work to reject
     */
    rejectWork(entry: ApprovalQueue) {
        let thisWork = entry.workToApprove as ContentModel;
        let thisWorksAuthor = thisWork.author as UserInfo;
        const decision: Decision = {
            docId: entry._id,
            workId: thisWork._id,
            authorId: thisWorksAuthor._id
        };

        this.store.dispatch(new AQNamespace.RejectWork(decision)).subscribe(() => {
            this.forceRefresh();
        });
    }
}