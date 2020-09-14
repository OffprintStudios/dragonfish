import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CollectionsService, WorksService } from '../../../../services/content';
import { Collection, WorkInfo } from '@pulp-fiction/models/collections';

@Component({
  selector: 'app-add-to-collection',
  templateUrl: './add-to-collection.component.html',
  styleUrls: ['./add-to-collection.component.less']
})
export class AddToCollectionComponent implements OnInit {
  workId: string;

  collections: Collection[];

  constructor(private collsService: CollectionsService, private worksService: WorksService,
    private dialogRef: MatDialogRef<AddToCollectionComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.workId = this.worksService.thisWorkId;
    this.collections = this.collsService.thisUsersCollections;
  }

  ngOnInit(): void {
  }

  /**
   * If the work ID is listed in 
   * @param coll The collection to check
   */
  checkIfInCollection(coll: Collection) {
    let isThere = null;

    coll.details.forEach((entry) => {
      let thisWork = entry.work as WorkInfo;
      if (thisWork._id === this.workId) {
        isThere = thisWork;
      }
    });

    if (isThere) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Adds a work to a collection.
   * 
   * @param coll The collection in question
   */
  addToCollection(coll: Collection) {
    this.collsService.addWork(coll._id, this.workId).subscribe(() => {
      this.dialogRef.close();
    });
  }

  /**
   * Removes a work from a collection.
   * 
   * @param coll The collection in question
   */
  removeFromCollection(coll: Collection) {
    this.collsService.removeWork(coll._id, this.workId).subscribe(() => {
      this.dialogRef.close();
    });
  }

  /**
   * Closes the modal.
   */
  cancel() {
    this.dialogRef.close();
  }
}
