import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth';
import { FrontendUser } from '@pulp-fiction/models/users';

@Component({
  selector: 'app-contrib',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  currentUser: FrontendUser; // the currently logged-in user

  constructor(private authService: AuthService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit(): void {
  }
}
