import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from '../../../services/auth';
import { PortfolioService } from '../../../services/content';
import { Collection } from '@pulp-fiction/models/collections';

@Component({
  selector: 'app-port-collection-page',
  templateUrl: './port-collection-page.component.html',
  styleUrls: ['./port-collection-page.component.less']
})
export class PortCollectionPageComponent implements OnInit {
  currentUser: FrontendUser; // The currently logged-in user
  portUserId: string; // The ID of the user whose portfolio this is
  portUserName: string; // The username associated with this portfolio
  collId: string; // The ID of this collection
  collection: Collection; // The collection itself
  loading = false; // Loading check for fetching data

  constructor(private authService: AuthService, private portService: PortfolioService, private route: ActivatedRoute) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData();
  }

  ngOnInit(): void {
  }

  /**
   * Fetches the collection to display.
   */
  private fetchData() {
    this.loading = true;
    this.route.parent.paramMap.subscribe(params => {
      this.portUserId = params.get('id');
      this.portUserName = params.get('username');
      this.route.paramMap.subscribe(params => {
        this.collId = params.get('collId');
        this.portService.getOneCollection(this.portUserId, this.collId).subscribe(coll => {
          this.collection = coll;
          this.loading = false;
        });
      });
    });
  }

  /**
   * Checks to see if the currently logged in user is the same as the one
   * that owns this portfolio.
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
