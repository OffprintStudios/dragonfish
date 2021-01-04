import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CollectionsService } from '../../../../services/content';
import { CollectionForm } from '@pulp-fiction/models/collections';

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.less']
})
export class CreateCollectionComponent implements OnInit {
  createCollectionForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
    desc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    public: new FormControl(false)
  });

  constructor(private collsService: CollectionsService, private snackbar: MatSnackBar, 
    private dialogRef: MatDialogRef<CreateCollectionComponent>) { }

  ngOnInit(): void {}

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

    const newCollection: CollectionForm = {
      name: this.fields.name.value,
      desc: this.fields.desc.value
    };

    this.collsService.createCollection(newCollection).subscribe(() => {
      this.dialogRef.close();
    });
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
