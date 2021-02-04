import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CollectionsService } from '../../../../services/content';
import { CollectionForm, Collection } from '@dragonfish/models/collections';

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.less']
})
export class CreateCollectionComponent implements OnInit {
  editMode = false;
  currColl: Collection;

  createCollectionForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
    desc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    public: new FormControl(false)
  });

  constructor(private collsService: CollectionsService, private snackbar: MatSnackBar, 
    private dialogRef: MatDialogRef<CreateCollectionComponent>, @Inject(MAT_DIALOG_DATA) private data: {currColl: Collection}) { }

  ngOnInit(): void {
    if (this.data) {
      this.editMode = true;
      this.currColl = this.data.currColl;
      this.createCollectionForm.setValue({
        name: this.currColl.name,
        desc: this.currColl.desc,
        public: this.currColl.audit.isPublic
      });
    } else {
      this.editMode = false;
    }
  }

  /**
   * Create collection form getter.
   */
  get fields() { return this.createCollectionForm.controls; }

  /**
   * Submits the new collection form for processing.
   */
  submitCollection() {
    if (this.fields.name.invalid) {
      this.snackbar.open(`Collections must have a name between 3 and 32 characters.`);
      return;
    }

    if (this.fields.desc.invalid) {
      this.snackbar.open(`Collections must have a description between 3 and 50 characters.`);
      return;
    }

    const collForm: CollectionForm = {
      name: this.fields.name.value,
      desc: this.fields.desc.value,
      public: this.fields.public.value
    };

    if (this.editMode === true) {
      this.collsService.editCollection(this.currColl._id, collForm).subscribe(() => {
        this.dialogRef.close();
      });
    } else {
      this.collsService.createCollection(collForm).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  /**
   * Ask to cancel form submission.
   */
  askCancel() {
    if (this.createCollectionForm.dirty || this.createCollectionForm.touched) {
      if (confirm('Are you sure? Any unsaved changes will be lost.')) {
        this.dialogRef.close();
      } else {
        return;
      }
    } else {
      this.dialogRef.close();
      return;
    }
  }
}
