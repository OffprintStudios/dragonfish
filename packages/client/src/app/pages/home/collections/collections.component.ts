import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FrontendUser } from '@pulp-fiction/models/users';
import { Collection } from '@pulp-fiction/models/collections';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../../services/auth';
import { CollectionsService } from '../../../services/content';
import { CreateCollectionComponent } from '../../../components/modals/collections';

import { GlobalConstants } from '../../../shared';
import { GlobalMethods } from '../../../shared/global-methods';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.less']
})
export class CollectionsComponent implements OnInit {
  currentUser: FrontendUser;

  loading = false;
  submitting = false;
  collections: PaginateResult<Collection>;

  pageNum = 1;

  constructor(private authService: AuthService, private collsService: CollectionsService, private dialog: MatDialog) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData(this.pageNum);
  }

  ngOnInit(): void {
    GlobalMethods.setTwoPartTitle(GlobalConstants.COLLECTIONS);
  }

  /**
   * Fetches a user's collections
   */
  fetchData(pageNum: number) {
    this.loading = true;
    this.collsService.fetchUserCollections(pageNum).subscribe(colls => {
      this.collections = colls;
      this.pageNum = pageNum;
      this.loading = false;
    });
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

  /**
   * Opens the create collection modal
   */
  openCreateCollectionModal() {
    this.dialog.open(CreateCollectionComponent);
  }
}
