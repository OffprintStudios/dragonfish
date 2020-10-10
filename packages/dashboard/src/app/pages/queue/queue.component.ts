import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { AuthService } from '../../services/auth';
import { QueueService } from '../../services/contrib/queue';
import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';
import { Decision } from '@pulp-fiction/models/contrib';
import { PaginateResult } from '@pulp-fiction/models/util';
import { FrontendUser } from '@pulp-fiction/models/users';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.less']
})
export class QueueComponent implements OnInit {
  currentUser: FrontendUser; // the currently logged-in user

  loading = false; // loading check
  queue: PaginateResult<ApprovalQueue>; // the approval queue
  queueForMod: PaginateResult<ApprovalQueue>; // the approval queue for a single mod

  pageNum = 1;

  forMe = false; // for switching views

  searchForm = new FormGroup({
    query: new FormControl('')
  });

  constructor(private authService: AuthService, private queueService: QueueService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData(this.pageNum);
  }
  ngOnInit(): void {
  }

  /**
   * Fetches entries based on which setting it is.
   * 
   * @param which Which entries to fetch
   */
  fetchData(pageNum: number) {
    this.queueService.getQueue(pageNum).subscribe(entries => {
      this.queue = entries;
      this.pageNum = pageNum;
    });

    this.queueService.getQueueForMod(pageNum).subscribe(entries => {
      this.queueForMod = entries;
      this.pageNum = pageNum;
    });
  }

  /**
   * Forces a refresh of the queue.
   */
  forceRefresh() {
    this.fetchData(1);
  }

  /**
   * Changes the queue view from all to personal.
   */
  changeQueueView() {
    if (this.forMe === true) {
      this.forMe = false;
    } else {
      this.forMe = true;
    }
  }

  /**
   * Checks to see if the queue is empty.
   */
  queueIsEmpty() {
    if (this.queue) {
      if (this.queue.docs.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * Checks to see if the mod queue is empty.
   */
  myQueueIsEmpty() {
    if (this.queueForMod) {
      if (this.queueForMod.docs.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * Checks if a queue item is claimed.
   * 
   * @param entry The queue item
   */
  checkIfClaimed(entry: ApprovalQueue) {
    if (entry.claimedBy === null) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Checks if a queue item is claimed by the currently signed in user.
   * 
   * @param entry The queue item
   */
  checkIfClaimedByThisUser(entry: ApprovalQueue) {
    if (entry.claimedBy !== null) {
      if (entry.claimedBy._id === this.currentUser._id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Claims a queue entry.
   * 
   * @param entry The document to claim
   */
  claimWork(entry: ApprovalQueue) {
    this.queueService.claimWork(entry._id).subscribe(() => {
      this.fetchData(this.pageNum);
    });
  }
  
  /**
   * Approves a work.
   * 
   * @param entry The entry to approve
   * @param work The work to approve
   */
  approveWork(entry: ApprovalQueue) {
    const decision: Decision = {
      docId: entry._id,
      workId: entry.workToApprove._id,
      authorId: entry.workToApprove.author._id
    };

    this.queueService.approveWork(decision).subscribe(() => {
      this.fetchData(this.pageNum);
    })
  }

  /**
   * Rejects a work.
   * 
   * @param entry The entry to reject
   * @param work The work to reject
   */
  rejectWork(entry: ApprovalQueue) {
    const decision: Decision = {
      docId: entry._id,
      workId: entry.workToApprove._id,
      authorId: entry.workToApprove.author._id
    };

    this.queueService.rejectWork(decision).subscribe(() => {
      this.fetchData(this.pageNum);
    })
  }
}