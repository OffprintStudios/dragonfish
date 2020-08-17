import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User, Collection } from 'shared-models';
import { AuthService } from 'src/app/services/auth';
import { PortfolioService, CollectionsService } from 'src/app/services/content';

@Component({
  selector: 'app-port-collections',
  templateUrl: './port-collections.component.html',
  styleUrls: ['./port-collections.component.less']
})
export class PortCollectionsComponent implements OnInit {
  currentUser: User; // The currently logged-in user
  portUserId: string; // The ID of the user whose portfolio this is
  portUserName: string; // The username associated with this portfolio
  portCollsData: Collection[]; // The list of public collections
  loading = false; // Loading check for fetching data
  submitting = false; // Submission check for changes to public collections

  constructor(private authService: AuthService, private portService: PortfolioService,
    private collsService: CollectionsService, private route: ActivatedRoute) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData();
  }

  ngOnInit(): void {
  }

  /**
   * Fetches the data for this user's public collections.
   */
  private fetchData() {
    this.loading = true;
    this.route.parent.paramMap.subscribe(params => {
      this.portUserId = params.get('id');
      this.portUserName = params.get('username');
      this.portService.getCollectionsList(this.portUserId).subscribe(colls => {
        this.portCollsData = colls;
        this.loading = false;
      });
    });
  }

  /**
   * Checks to see if the portCollsData array contains collections. Returns true
   * if there's collections, but false otherwise.
   */
  collectionsArePresent() {
    if (this.portCollsData) {
      if (this.portCollsData.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
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

  setPublic(collId: string) {

  }

  setPrivate(collId: string) {

  }

  askDelete(collId: string) {

  }
}
