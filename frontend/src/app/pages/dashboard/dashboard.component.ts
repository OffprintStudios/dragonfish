import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/users';
import { ApprovalQueue, Decision } from 'src/app/models/admin';
import { AuthService } from 'src/app/services/auth';
import { QueueService } from 'src/app/services/admin';

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
