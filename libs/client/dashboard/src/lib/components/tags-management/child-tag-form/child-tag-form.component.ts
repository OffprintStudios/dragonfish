import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { TagsService } from '@dragonfish/client/repository/dashboard/tags';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChildTagsModel, TagsForm } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-child-tag-form',
    templateUrl: './child-tag-form.component.html',
})
export class ChildTagFormComponent implements OnInit {
    formTitle = `Create a Child Tag`;
    editMode = false;

    tagForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        desc: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    });

    constructor(
        private alerts: AlertsService,
        private tagsService: TagsService,
        public dialogRef: MatDialogRef<ChildTagFormComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { parentId: string, child: ChildTagsModel }
    ) {}

    ngOnInit(): void {
        if (this.data.child) {
            this.tagForm.setValue({
                name: this.data.child.name,
                desc: this.data.child.desc,
            });
            this.editMode = true;
            this.formTitle = `Editing Child Tag`;
        } else {
            this.editMode = false;
            this.formTitle = `Create a Child Tag`;
        }
    }

    private get fields() { return this.tagForm.controls; }

    submitForm() {
        if (this.fields.name.invalid) {
            this.alerts.info(`Tags must have a name.`);
        }

        if (this.fields.desc.invalid) {
            this.alerts.info(`You must include a description, and it cannot exceed 100 characters.`);
        }

        const form: TagsForm = {
            name: this.fields.name.value,
            desc: this.fields.desc.value,
        };

        if (this.editMode) {
            this.tagsService.updateChild(this.data.parentId, this.data.child._id, form).subscribe(() => {
                this.dialogRef.close();
            });
        } else {
            this.tagsService.addChild(this.data.parentId, form).subscribe(() => {
                this.dialogRef.close();
            });
        }
    }
}
