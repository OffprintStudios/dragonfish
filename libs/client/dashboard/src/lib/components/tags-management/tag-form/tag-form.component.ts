import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TagsService } from '@dragonfish/client/repository/dashboard/tags';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TagKind, TagsForm, TagsModel } from '@dragonfish/shared/models/content';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-tag-form',
    templateUrl: './tag-form.component.html',
})
export class TagFormComponent implements OnInit {
    formTitle = `Create a Tag`;
    editMode = false;

    tagForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        desc: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    });

    constructor(
        private alerts: AlertsService,
        private tagsService: TagsService,
        public dialogRef: MatDialogRef<TagFormComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { tag: TagsModel }
    ) {}

    ngOnInit(): void {
        if (this.data.tag) {
            this.tagForm.setValue({
                name: this.data.tag.name,
                desc: this.data.tag.desc,
            });
            this.editMode = true;
            this.formTitle = `Editing Tag`;
        } else {
            this.editMode = false;
            this.formTitle = `Create a Tag`;
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
            this.tagsService.updateTag(this.data.tag._id, form).subscribe(() => {
                this.dialogRef.close();
            });
        } else {
            this.tagsService.createTag(TagKind.Fandom, form).subscribe(() => {
                this.dialogRef.close();
            });
        }
    }
}
