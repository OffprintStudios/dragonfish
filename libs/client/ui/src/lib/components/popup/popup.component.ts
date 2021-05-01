import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupModel } from '@dragonfish/shared/models/util';

@Component({
    selector: 'dragonfish-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
    constructor(
        public dialogRef: MatDialogRef<PopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PopupModel,
    ) {}

    closeDialog(): void {
        this.dialogRef.close();
    }
}
