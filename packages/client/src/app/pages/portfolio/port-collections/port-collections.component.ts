import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FrontendUser } from '@pulp-fiction/models/users';
import { Collection } from '@pulp-fiction/models/collections';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../../services/auth';
import { PortfolioService, CollectionsService } from '../../../services/content';

import { GlobalConstants } from '../../../shared';
import { GlobalMethods } from '../../../shared/global-methods';

@Component({
  selector: 'app-port-collections',
  templateUrl: './port-collections.component.html',
  styleUrls: ['./port-collections.component.less']
})
export class PortCollectionsComponent implements OnInit {
  currentUser: FrontendUser; // The currently logged-in user
  portUserId: string; // The ID of the user whose portfolio this is
  portUserName: string; // The username associated with this portfolio
  portCollsData: PaginateResult<Collection>; // The list of public collections
  loading = false; // Loading check for fetching data
  submitting = false; // Submission check for changes to public collections

  pageNum = 1;

  constructor(private authService: AuthService, private portService: PortfolioService,
    private collsService: CollectionsService, private route: ActivatedRoute) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData(this.pageNum);
  }

  ngOnInit(): void {
    GlobalMethods.setThreePartTitle(this.portUserName, GlobalConstants.COLLECTIONS);
  }

  /**
   * Fetches the data for this user's public collections.
   */
  fetchData(pageNum: number) {
    this.loading = true;
    this.route.parent.paramMap.subscribe(params => {
      this.portUserId = params.get('id');
      this.portUserName = params.get('username');
      this.portService.getCollectionsList(this.portUserId, pageNum).subscribe(colls => {
        this.portCollsData = colls;
        this.pageNum = 1;
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
      if (this.portCollsData.docs.length > 0) {
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

  /**
   * Sets a collection to public.
   * 
   * @param collId The collection's ID
   */
  setPublic(collId: string) {
    this.submitting = true;
    this.collsService.setToPublic(collId).subscribe(() => {
      this.submitting = false;
      this.fetchData(this.pageNum);
    });
  }

  /**
   * Sets a collection to private.
   * 
   * @param collId The collection's ID
   */
  setPrivate(collId: string) {
    this.submitting = true;
    this.collsService.setToPrivate(collId).subscribe(() => {
      this.submitting = false;
      this.fetchData(this.pageNum);
    });
  }

  /**
   * Sends a request to delete the specified collection.
   * 
   * @param collId The collection to delete
   */
  askDelete(collId: string) {
    if (confirm(`Are you sure you want to delete this collection? This action is irreversible.`)) {
      this.collsService.deleteCollection(collId).subscribe(() => {
        this.fetchData(this.pageNum);
      });
    } else {
      return;
    }
  }
}
