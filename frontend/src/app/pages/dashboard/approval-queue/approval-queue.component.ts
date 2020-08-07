import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/users';

@Component({
  selector: 'app-approval-queue',
  templateUrl: './approval-queue.component.html',
  styleUrls: ['./approval-queue.component.less']
})
export class ApprovalQueueComponent implements OnInit {
  currentUser: User; // The currently signed in user.

  constructor() { }

  ngOnInit(): void {
  }

}
