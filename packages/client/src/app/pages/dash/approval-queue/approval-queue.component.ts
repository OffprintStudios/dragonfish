import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AuthState } from '../../../shared/auth';

import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';
import { ContentKind, ContentModel } from '@pulp-fiction/models/content';
import { Decision } from '@pulp-fiction/models/contrib';
import { FrontendUser, UserInfo } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../../services/auth';
import { ApprovalQueueService } from './approval-queue.service';

@Component({
    selector: 'approval-queue',
    templateUrl: './approval-queue.component.html',
    styleUrls: ['./approval-queue.component.less']
})
export class ApprovalQueueComponent implements OnInit {
    @Select(AuthState.user) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    queue: PaginateResult<ApprovalQueue>;
    contentKind = ContentKind;

    pageNum = 1;

    constructor(private queueService: ApprovalQueueService, private route: ActivatedRoute, private router: Router) {
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

    getOffprintWorkLink(entry: ApprovalQueue, workNameSlug: string) {
        let thisWork = entry.workToApprove as ContentModel;
        if (thisWork.kind === ContentKind.ProseContent) {
            return `https://offprint.net/prose/${thisWork._id}/${workNameSlug}`;
        } else if (thisWork.kind === ContentKind.PoetryContent) {
            return `https://offprint.net/poetry/${thisWork._id}/${workNameSlug}`;
        }
    }
    
    getOffprintUserLink(userId: string, usernameSlug: string) {
        return `https://offprint.net/portfolio/${userId}/${usernameSlug}`;
    }

    forceRefresh() {
        this.router.navigate([], {relativeTo: this.route, queryParams: {page: this.pageNum}, queryParamsHandling: 'merge'});
    }

    queueIsEmpty() {
        if (this.queue.docs.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    checkIfClaimed(entry: ApprovalQueue) {
        if (entry.claimedBy === null || entry.claimedBy === undefined) {
            return false;
        } else {
            return true;
        }
    }

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

    claimWork(entry: ApprovalQueue) {
        this.queueService.claimWork(entry._id).subscribe(() => {
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

        this.queueService.approveWork(decision).subscribe(() => {
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

        this.queueService.rejectWork(decision).subscribe(() => {
            this.forceRefresh();
        });
    }
}