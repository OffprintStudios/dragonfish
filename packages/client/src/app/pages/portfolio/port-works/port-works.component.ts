import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../services/auth';
import { PortfolioService } from '../../../services/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { Work } from '@pulp-fiction/models/works';
import { PaginateResult } from '@pulp-fiction/models/util';
import { calculateApprovalRating } from '../../../util/functions';
import { PortWorks } from '../../../models/site';

import { Constants, Title } from '../../../shared';

@Component({
  selector: 'app-port-works',
  templateUrl: './port-works.component.html',
  styleUrls: ['./port-works.component.less']
})
export class PortWorksComponent implements OnInit {
  currentUser: FrontendUser; // The currently logged-in user
  portUser: FrontendUser; // The user whose portfolio this is
  portUserId: string; // The ID of the user whose portfolio this is
  portUserName: string; // The username associated with this portfolio
  portWorksData: PaginateResult<Work>; // The list of published works

  pageNum = 1;

  constructor(private route: ActivatedRoute, private portService: PortfolioService,
    private authService: AuthService, private router: Router) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
    }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const feedData = data.feedData as PortWorks;
      this.portUserId = feedData.userId;
      this.portWorksData = feedData.works;
    });
    this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
    Title.setThreePartTitle(this.portUser.username, Constants.WORKS);
  }

  /**
   * Handles page changing
   * 
   * @param event The new page
   */
  onPageChange(event: number) {
    this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
    this.pageNum = event;
  }

  /**
   * Checks to see if the portWorksData array contains works. Returns true if there's works,
   * but false otherwise.
   */
  worksArePresent() {
    if (this.portWorksData) {
      if (this.portWorksData.docs.length > 0) {
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

  /**
   * Calculates a work's approval rating.
   * 
   * @param likes Number of likes
   * @param dislikes Number of dislikes
   */
  calcApprovalRating(likes: number, dislikes: number) {
    return calculateApprovalRating(likes, dislikes);
  }
}
