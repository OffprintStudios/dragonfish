import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NetworkService } from '../../../../services';
import { CollectionForm, Collection } from '@dragonfish/shared/models/collections';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-collection-form',
    templateUrl: './collection-form.component.html',
    styleUrls: ['./collection-form.component.scss'],
})
export class CollectionFormComponent implements OnInit {
    editMode = false;
    currColl: Collection;

    collectionForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
        desc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        public: new FormControl(false),
    });

    constructor(
        private networkService: NetworkService,
        private alerts: AlertsService,
        private dialogRef: MatDialogRef<CollectionFormComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { currColl: Collection },
    ) {}

    ngOnInit(): void {
        if (this.data) {
            this.editMode = true;
            this.currColl = this.data.currColl;
            this.collectionForm.setValue({
                name: this.currColl.name,
                desc: this.currColl.desc,
                public: this.currColl.audit.isPublic,
            });
        } else {
            this.editMode = false;
        }
    }

    /**
     * Create collection form getter.
     */
    get fields() {
        return this.collectionForm.controls;
    }

    /**
     * Submits the new collection form for processing.
     */
    submitCollection() {
        if (this.fields.name.invalid) {
            this.alerts.warn(`Collections must have a name between 3 and 32 characters.`);
            return;
        }

        if (this.fields.desc.invalid) {
            this.alerts.warn(`Collections must have a description between 3 and 50 characters.`);
            return;
        }

        const collForm: CollectionForm = {
            name: this.fields.name.value,
            desc: this.fields.desc.value,
            public: this.fields.public.value,
        };

        if (this.editMode === true) {
            this.networkService.editCollection(this.currColl._id, collForm).subscribe(() => {
                this.dialogRef.close();
            });
        } else {
            this.networkService.createCollection(collForm).subscribe(() => {
                this.dialogRef.close();
            });
        }
    }

    /**
     * Ask to cancel form submission.
     */
    askCancel() {
        if (this.collectionForm.dirty || this.collectionForm.touched) {
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
