import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
} from '@dragonfish/shared/models/content';
import { TagsQuery, TagsService } from '@dragonfish/client/repository/tags';

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
        public tagsQuery: TagsQuery,
        private tagsService: TagsService,
    ) {}

    ngOnInit(): void {
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

    private setFormValue(content: ContentModel) {
        this.workForm.setValue({
            title: content.title,
            desc: content.desc,
            body: content.body,
            category: (content.meta as any).category,
            genres: (content.meta as any).genres,
            tags: (content.meta as any).tags,
            rating: content.meta.rating,
            status: (content.meta as any).status,
        });
    }
}
