import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/users';
import { ApprovalQueue } from 'src/app/models/admin';
import { AuthService } from 'src/app/services/auth';
import { QueueService } from 'src/app/services/admin';

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
      this.queue = entries.reverse();
    });

    this.queueService.getQueueForMod().subscribe(entries => {
      this.queueForMod = entries.reverse();
    });
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
}
