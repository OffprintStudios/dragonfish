import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from '../../../services/auth';
import { PortfolioService } from '../../../services/content';
import { Collection } from '@pulp-fiction/models/collections';
import { CollPage } from '../../../models/site';

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

  constructor(private authService: AuthService, private portService: PortfolioService, private route: ActivatedRoute) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
  }

  ngOnInit(): void {
    const collData = this.route.snapshot.data.collData as CollPage;
    this.portUserId = collData.userId;
    this.collection = collData.collection;
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
