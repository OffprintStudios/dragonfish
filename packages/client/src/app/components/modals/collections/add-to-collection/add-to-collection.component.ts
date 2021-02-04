import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CollectionsService } from '../../../../services/content';
import { Collection } from '@dragonfish/models/collections';
import { ContentModel } from '@dragonfish/models/content';

@Component({
  selector: 'app-add-to-collection',
  templateUrl: './add-to-collection.component.html',
  styleUrls: ['./add-to-collection.component.less']
})
export class AddToCollectionComponent implements OnInit {
  currContent: ContentModel;
  collections: Collection[];

  loading = false;

  constructor(private collsService: CollectionsService, private dialogRef: MatDialogRef<AddToCollectionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {content: ContentModel}) {
      this.fetchData();
    }

  ngOnInit(): void {
    this.currContent = this.data.content;
  }

  private fetchData() {
    this.loading = true;
    this.collsService.getAllCollectionsNoPaginate().subscribe(colls => {
      this.collections = colls;
      console.log(this.collections);
      this.loading = false;
    });
  }

  /**
   * If the work ID is listed in 
   * @param coll The collection to check
   */
  checkIfInCollection(coll: Collection) {
    let isThere = null;

    coll.contains.forEach((entry) => {
      const thisContent = entry as ContentModel;
      if (thisContent._id === this.currContent._id) {
        isThere = entry;
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
    this.collsService.addWork(coll._id, this.currContent._id).subscribe(() => {
      this.dialogRef.close();
    });
  }

  /**
   * Removes a work from a collection.
   * 
   * @param coll The collection in question
   */
  removeFromCollection(coll: Collection) {
    this.collsService.removeWork(coll._id, this.currContent._id).subscribe(() => {
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
