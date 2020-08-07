import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/users';
import { ApprovalQueue, Decision } from 'src/app/models/admin';
import { AuthService } from 'src/app/services/auth';
import { QueueService } from 'src/app/services/admin';
import { Work } from 'src/app/models/works';

@Component({
  selector: 'app-approval-queue',
  templateUrl: './approval-queue.component.html',
  styleUrls: ['./approval-queue.component.less']
})
export class ApprovalQueueComponent implements OnInit {
  currentUser: User; // the currently logged-in user

  loading = false; // loading check
  queue: ApprovalQueue[]; // the approval queue
  queueForMod: ApprovalQueue[]; // the 

  forMe = false; // for switching views

  constructor(private authService: AuthService, private queueService: QueueService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData();
  }
  ngOnInit(): void {
  }

  /**
   * Fetches entries based on which setting it is.
   * 
   * @param which Which entries to fetch
   */
  private fetchData() {
    this.queueService.getQueue().subscribe(entries => {
      this.queue = entries;
    });

    this.queueService.getQueueForMod().subscribe(entries => {
      this.queueForMod = entries;
    });
  }

  /**
   * Forces a refresh of the queue.
   */
  forceRefresh() {
    this.fetchData();
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
    if (this.queue.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks to see if the mod queue is empty.
   */
  myQueueIsEmpty() {
    if (this.queueForMod.length === 0) {
      return true;
    } else {
      return false;
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
      this.fetchData();
    });
  }
  
  /**
   * Approves a work.
   * 
   * @param entry The entry to approve
   * @param work The work to approve
   */
  approveWork(entry: ApprovalQueue, work: Work) {
    const decision: Decision = {
      docId: entry._id,
      workId: work._id,
      authorId: work.author._id
    };

    this.queueService.approveWork(decision).subscribe(() => {
      this.fetchData();
    })
  }

  /**
   * Rejects a work.
   * 
   * @param entry The entry to reject
   * @param work The work to reject
   */
  rejectWork(entry: ApprovalQueue, work: Work) {
    const decision: Decision = {
      docId: entry._id,
      workId: work._id,
      authorId: work.author._id
    };

    this.queueService.rejectWork(decision).subscribe(() => {
      this.fetchData();
    })
  }
}
