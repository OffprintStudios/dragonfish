import { Component, OnInit } from '@angular/core';

import { CollectionsService, WorksService } from 'src/app/services/content';
import { Collection } from 'shared-models';

@Component({
  selector: 'app-add-to-collection',
  templateUrl: './add-to-collection.component.html',
  styleUrls: ['./add-to-collection.component.less']
})
export class AddToCollectionComponent implements OnInit {
  close: any;
  workId: string;

  collections: Collection[];

  constructor(private collsService: CollectionsService, private worksService: WorksService) {
    this.workId = this.worksService.thisWorkId;
    this.collections = this.collsService.thisUsersCollections;
  }

  ngOnInit(): void {
  }

  
}
