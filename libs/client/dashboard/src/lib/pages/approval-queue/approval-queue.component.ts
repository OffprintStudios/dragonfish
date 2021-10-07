import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { ContentKind, ContentModel, TagKind } from '@dragonfish/shared/models/content';
import { UserInfo } from '@dragonfish/shared/models/users';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { ApprovalQueueService } from '@dragonfish/client/repository/dashboard/approval-queue';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-approval-queue',
    templateUrl: './approval-queue.component.html',
    styleUrls: ['./approval-queue.component.scss'],
})
export class ApprovalQueueComponent implements OnInit {
    queue: PaginateResult<ApprovalQueue>;
    contentKind = ContentKind;
    tagKinds = TagKind;
    pageNum = 1;

    constructor(
        public route: ActivatedRoute,
        private router: Router,
        private alerts: AlertsService,
        public sessionQuery: SessionQuery,
        private queueService: ApprovalQueueService,
    ) {}

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.queue = data.queueData as PaginateResult<ApprovalQueue>;
        });
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     */
    onPageChange(event: number) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event },
            queryParamsHandling: 'merge',
        });
        this.pageNum = event;
    }

    /**
     * Goes to the appropriate content view for the following queue entry.
     *
     * @param entry The approval queue entry
     */
    goToContentView(entry: ApprovalQueue) {
        this.queueService.selectWork(entry);
        const content: ContentModel = entry.workToApprove as ContentModel;
        if (content.kind === ContentKind.ProseContent) {
            this.router.navigate(['view-prose'], { relativeTo: this.route });
        } else if (content.kind === ContentKind.PoetryContent) {
            this.router.navigate(['view-poetry'], { relativeTo: this.route });
        } else {
            this.alerts.warn(`...what's this doing here?`);
        }
    }

    /**
     * Forces a refresh of the current page of the queue.
     */
    forceRefresh() {
        // eventually, none of this will be necessary and items will be updated in-place.
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: this.pageNum },
            queryParamsHandling: 'merge',
        });
    }

    /**
     * Checks to see if the queue is empty.
     */
    queueIsEmpty() {
        return this.queue.docs.length === 0;
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
            const whoClaimedThis = entry.claimedBy as UserInfo;
            return whoClaimedThis._id === this.sessionQuery.currentUser._id;
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
        this.queueService.claimWork(entry).subscribe(() => {
            this.forceRefresh();
        });
    }
}
