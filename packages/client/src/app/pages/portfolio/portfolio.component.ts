import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from '../../services/auth';
import { PortfolioService } from '../../services/content';
import { StartConversationComponent } from '../../components/portfolio/start-conversation/start-conversation.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit {
  portUser: FrontendUser; // The user whose portfolio this is
  portUserId: string; // Their ID, fetched from the route parameters

  currentUser: FrontendUser; // The currently logged-in user
  loading = false; // Loading check for fetching data

  constructor(private authService: AuthService, private router: Router, public route: ActivatedRoute,
    private portService: PortfolioService, public dialog: MatDialog) {
    this.authService.currUser.subscribe(x => {
      this.currentUser = x;
    });
    this.fetchData();
  }

  ngOnInit(): void {
  }

  /**
   * Fetches the data for this portfolio
   */
  private fetchData() {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.portUserId = params.get('id');
      this.portService.getUserInfo(this.portUserId).subscribe(x => {
        this.portUser = x;
        this.loading = false;
      });
    });
  }

  /**
   * Checks to see if the currently logged in user is the same as the user who owns this portfolio.
   */
  currentUserIsSame() {
    if (this.currentUser) {
      if (this.portUser) {
        if (this.currentUser._id === this.portUser._id) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  /**
   * Opens the new message dialog
   */
  startNewConversation() {
    if (this.portUserId) {
      this.dialog.open(StartConversationComponent, {data: {userId: this.portUserId}});
    }
  }
}
