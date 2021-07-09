import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'dragonfish-auth-modal',
    templateUrl: './auth-modal.component.html',
    styleUrls: ['./auth-modal.component.scss'],
})
export class AuthModalComponent {
    constructor(public dialogRef: MatDialogRef<AuthModalComponent>) { }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
