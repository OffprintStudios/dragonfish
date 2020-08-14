import { Component, OnInit } from '@angular/core';

import { User, Collection } from 'shared-models';
import { AuthService } from 'src/app/services/auth';
import { CollectionsService } from 'src/app/services/content';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.less']
})
export class CollectionsComponent implements OnInit {
  currentUser: User;

  loading = false;
  collections: Collection[];

  constructor(private authService: AuthService, private collsService: CollectionsService) {
    this.authService.currUser.subscribe(x => { this.currentUser = x; });
    this.fetchData();
  }

  ngOnInit(): void {}

  private fetchData() {
    this.loading = true;
    this.collsService.fetchUserCollections().subscribe(colls => {
      this.collections = colls;
      this.loading = false;
    });
  }
}
