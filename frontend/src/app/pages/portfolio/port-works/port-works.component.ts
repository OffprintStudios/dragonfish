import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from 'src/app/models/users';
import { Work } from 'src/app/models/works';
import { AuthService } from 'src/app/services/auth';
import { PortfolioService, WorksService } from 'src/app/services/content';

@Component({
  selector: 'app-port-works',
  templateUrl: './port-works.component.html',
  styleUrls: ['./port-works.component.less']
})
export class PortWorksComponent implements OnInit {
  currentUser: User; // The currently logged-in user
  portUserId: string; // The ID of the user whose portfolio this is
  portUserName: string; // The username associated with this portfolio
  portWorksData: Work[]; // The list of published works
  loading = false; // Loading check for fetching data

  constructor(private route: ActivatedRoute, private portService: PortfolioService,
    private authService: AuthService) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.fetchData();
    }

  ngOnInit(): void {
  }

  /**
   * Fetches the data for this user's published works list.
   */
  private fetchData() {
    this.loading = true;
    this.route.parent.paramMap.subscribe(params => {
      this.portUserId = params.get('id');
      this.portUserName = params.get('username');
      this.portService.getWorksList(this.portUserId).subscribe(works => {
        this.portWorksData = works;
        this.loading = false;
      });
    });
  }

  /**
   * Checks to see if the portWorksData array contains works. Returns true if there's works,
   * but false otherwise.
   */
  worksArePresent() {
    if (this.portWorksData) {
      if (this.portWorksData.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Checks to see if the currently logged in user is the same as the one that owns this
   * portfolio.
   */
  currentUserIsSame() {
    if (this.currentUser) {
      if (this.currentUser._id === this.portUserId) {
        return true;
      } else {
        return false;
      }
    }
  }
}
