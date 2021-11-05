import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkFormData } from './work-form-data';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    MAX_DESC_LENGTH,
    MAX_FANDOM_TAGS,
    MAX_GENRES,
    MAX_TITLE_LENGTH,
    MIN_GENRES,
    MIN_TEXT_LENGTH,
    TAGS_ENABLED,
} from '@dragonfish/shared/constants/content-constants';
import {
    ContentRating,
    ContentKind,
    Genres,
    WorkKind,
    WorkStatus,
    ContentModel,
    PoetryForm,
    CreatePoetry,
    CreateProse,
    TagKind,
    TagsModel,
} from '@dragonfish/shared/models/content';
import { TagsQuery, TagsService } from '@dragonfish/client/repository/tags';
import { AlertsService } from '@dragonfish/client/alerts';
import { WorkPageService } from '@dragonfish/client/repository/work-page';
import { UserWorksService } from '@dragonfish/client/repository/profile/user-works';

@Component({
    selector: 'dragonfish-work-form',
    templateUrl: './work-form.component.html',
})
export class WorkFormComponent implements OnInit {
    categories = WorkKind;
    genres = Genres;
    ratings = ContentRating;
    statuses = WorkStatus;
    formTitle = 'Create Prose';
    forms = PoetryForm;
    kind = ContentKind;

    tagsEnabled = TAGS_ENABLED;

    workForm = new FormGroup({
        title: new FormControl('', [
            Validators.required,
            Validators.minLength(MIN_TEXT_LENGTH),
            Validators.maxLength(MAX_TITLE_LENGTH),
        ]),
        desc: new FormControl('', [
            Validators.required,
            Validators.minLength(MIN_TEXT_LENGTH),
            Validators.maxLength(MAX_DESC_LENGTH),
        ]),
        body: new FormControl('', [Validators.required, Validators.minLength(MIN_TEXT_LENGTH)]),
        form: new FormControl(null),
        category: new FormControl(null, [Validators.required]),
        genres: new FormControl(
            [],
            [Validators.required, Validators.minLength(MIN_GENRES), Validators.maxLength(MAX_GENRES)],
        ),
        tags: new FormControl([], [Validators.maxLength(MAX_FANDOM_TAGS)]),
        rating: new FormControl(null, [Validators.required]),
        status: new FormControl(null, [Validators.required]),
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: WorkFormData,
        public dialogRef: MatDialogRef<WorkFormComponent>,
        public tagsQuery: TagsQuery,
        private alerts: AlertsService,
        private tagsService: TagsService,
        private workPage: WorkPageService,
        private userWorks: UserWorksService,
    ) {}

    ngOnInit(): void {
        this.tagsService.fetchTagsTrees(TagKind.Fandom).subscribe();

        switch (this.data.kind) {
            case ContentKind.ProseContent:
                if (this.data.content) {
                    this.formTitle = 'Editing Prose';
                    this.setFormValue(this.data.content);
                } else {
                    this.formTitle = 'Create Prose';
                }
                break;
            case ContentKind.PoetryContent:
                if (this.data.content) {
                    this.formTitle = 'Editing Poetry';
                    this.setFormValue(this.data.content);
                } else {
                    this.formTitle = 'Create Poetry';
                }
                break;
            default:
                this.formTitle = 'Create Prose';
                break;
        }
    }

    cancel() {
        this.dialogRef.close();
    }

    submitForm() {
        if (this.fields.title.invalid) {
            this.alerts.warn('Title field has an invalid length. Maximum is '+ MAX_TITLE_LENGTH + ' characters.');
            return;
        }
        if (this.fields.desc.invalid) {
            this.alerts.warn('Short description has an invalid length.');
            return;
        }
        if (this.fields.body.invalid) {
            this.alerts.warn('Body text is too short.');
            return;
        }
        if (this.fields.category.invalid) {
            this.alerts.warn('Category is required.');
            return;
        }
        if (this.data.kind === ContentKind.PoetryContent && this.fields.form.value === null) {
            this.alerts.warn('Form is required.');
            return;
        }
        if (this.fields.genres.invalid) {
            this.alerts.warn('Invalid number of genres. Limit is ' + MAX_GENRES + '.');
            return;
        }
        if (this.fields.rating.invalid) {
            this.alerts.warn('Rating is required.');
            return;
        }
        if (this.fields.status.invalid) {
            this.alerts.warn('Status is required.');
            return;
        }

        if (this.data.kind === ContentKind.ProseContent) {
            this.saveProse();
        } else if (this.data.kind === ContentKind.PoetryContent) {
            this.savePoetry();
        }
    }

    private get fields() {
        return this.workForm.controls;
    }

    private saveProse(): void {
        const formInfo: CreateProse = {
            title: this.fields.title.value,
            desc: this.fields.desc.value,
            body: this.fields.body.value,
            category: this.fields.category.value,
            genres: this.fields.genres.value,
            tags: this.fields.tags.value,
            rating: this.fields.rating.value,
            status: this.fields.status.value,
        };

        if (this.data.content) {
            this.workPage.save(this.data.content._id, ContentKind.ProseContent, formInfo).subscribe(() => {
                this.dialogRef.close();
            });
        } else {
            this.userWorks.create(ContentKind.ProseContent, formInfo).subscribe(() => {
                this.dialogRef.close();
            });
        }
    }

    private savePoetry(): void {
        const formInfo: CreatePoetry = {
            title: this.fields.title.value,
            desc: this.fields.desc.value,
            body: this.fields.body.value,
            category: this.fields.category.value,
            collection: true,
            form: this.fields.form.value,
            genres: this.fields.genres.value,
            tags: this.fields.tags.value,
            rating: this.fields.rating.value,
            status: this.fields.status.value,
        };

        if (this.data.content) {
            this.workPage.save(this.data.content._id, ContentKind.PoetryContent, formInfo).subscribe(() => {
                this.dialogRef.close();
            });
        } else {
            this.userWorks.create(ContentKind.PoetryContent, formInfo).subscribe(() => {
                this.dialogRef.close();
            });
        }
    }

    private setFormValue(content: ContentModel) {
        this.workForm.setValue({
            title: content.title,
            desc: content.desc,
            body: content.body,
            category: (content.meta as any).category,
            form: content.kind === 'PoetryContent' ? (content.meta as any).form : null,
            genres: (content.meta as any).genres,
            tags: content.tags.map((tag) => (tag as TagsModel)._id),
            rating: content.meta.rating,
            status: (content.meta as any).status,
        });
    }
}
