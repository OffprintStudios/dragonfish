import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MyStuffService } from 'packages/client/src/app/services/user';
import { FolderForm } from '@pulp-fiction/models/content';

@Component({
  selector: 'pulp-fiction-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.less']
})
export class NewFolderComponent implements OnInit {

  newFolderForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  });

  constructor(private stuffService: MyStuffService, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<NewFolderComponent>) { }

  ngOnInit(): void { }

  get fields() { return this.newFolderForm.controls; }

  submitForm() {
    if (this.fields.name.invalid) {
      this.snackBar.open(`The folder name must be between 3 and 50 characters.`);
      return;
    }

    const folderInfo: FolderForm = {
      name: this.fields.name.value
    };

    this.stuffService.createFolder(folderInfo).subscribe(() => {
      this.dialogRef.close();
    })
  }

  cancel() {
    this.dialogRef.close();
  }
}
