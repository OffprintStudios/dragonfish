import { Component, OnInit } from '@angular/core';
import { Toppy, ToppyControl, GlobalPosition, InsidePlacement } from 'toppy';

import { FrontendUser } from '@pulp-fiction/models/users';
import { Collection } from '@pulp-fiction/models/collections';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AuthService } from '../../../services/auth';
import { CollectionsService } from '../../../services/content';
import { CreateCollectionComponent } from '../../../components/modals/collections';

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

  createCollection: ToppyControl;

  constructor(private authService: AuthService, private collsService: CollectionsService, private toppy: Toppy) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData(this.pageNum);
  }

  ngOnInit(): void {
    // Creates the Create Collection modal
    const position = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: '90%',
      height: 'auto',
    });

    this.createCollection = this.toppy
    .position(position)
    .config({backdrop: true, closeOnDocClick: true, closeOnEsc: true})
    .content(CreateCollectionComponent)
    .create();

    this.createCollection.listen('t_close').subscribe(() => {
      this.fetchData(1);
    });
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
    this.createCollection.open();
  }
}
