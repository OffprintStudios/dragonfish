import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth';
import { QueueService } from 'src/app/services/admin';
import { ApprovalQueue, Decision, User } from 'shared-models';

@Component({
  selector: 'app-contrib',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  currentUser: User; // the currently logged-in user

  constructor(private authService: AuthService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit(): void {
  }
}
