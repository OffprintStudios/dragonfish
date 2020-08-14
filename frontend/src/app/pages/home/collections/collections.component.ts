import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Toppy, ToppyControl, GlobalPosition, InsidePlacement, RelativePosition, OutsidePlacement } from 'toppy';

import { User, Collection } from 'shared-models';
import { AuthService } from 'src/app/services/auth';
import { CollectionsService } from 'src/app/services/content';
import { CreateCollectionComponent } from 'src/app/components/modals/collections';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.less']
})
export class CollectionsComponent implements OnInit {
  currentUser: User;

  loading = false;
  collections: Collection[];

  createCollection: ToppyControl;

  constructor(private authService: AuthService, private collsService: CollectionsService, private toppy: Toppy) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData();
  }

  ngOnInit(): void {
    // Creates the Create Collection modal
    const position = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: 'auto',
      height: 'auto',
    });

    this.createCollection = this.toppy
    .position(position)
    .config({backdrop: true, closeOnDocClick: true, closeOnEsc: true})
    .content(CreateCollectionComponent)
    .create();

    this.createCollection.listen('t_close').subscribe(() => {
      this.fetchData();
    });
  }

  /**
   * Fetches a user's collections
   */
  private fetchData() {
    this.loading = true;
    this.collsService.fetchUserCollections().subscribe(colls => {
      this.collections = colls;
      this.loading = false;
    });
  }

  /**
   * Opens the create collection modal
   */
  openCreateCollectionModal() {
    this.createCollection.open();
  }
}
