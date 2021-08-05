import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    WorkKind,
    CreatePoetry,
    PoetryForm,
    Genres,
    ContentRating,
    WorkStatus,
    PoetryContent,
    ContentKind,
} from '@dragonfish/shared/models/content';
import { AlertsService } from '@dragonfish/client/alerts';
import { MyStuffQuery, MyStuffService } from '@dragonfish/client/repository/my-stuff';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@UntilDestroy()
@Component({
    selector: 'dragonfish-poetry-form',
    templateUrl: './poetry-form.component.html',
    styleUrls: ['./poetry-form.component.scss'],
})
export class PoetryFormComponent implements OnInit {
    formTitle = `Create New Poetry`;

    categories = WorkKind;
    forms = PoetryForm;
    genres = Genres;
    ratings = ContentRating;
    statuses = WorkStatus;
    isCollection = false;

    poetryForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        desc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        category: new FormControl(null, [Validators.required]),
        form: new FormControl(null, [Validators.required]),
        genres: new FormControl([], [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
        rating: new FormControl(null, [Validators.required]),
        status: new FormControl(null, [Validators.required]),
    });

    constructor(
        private stuff: MyStuffService,
        private alerts: AlertsService,
        public stuffQuery: MyStuffQuery,
        private router: Router,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.stuffQuery.current$.pipe(untilDestroyed(this)).subscribe((content: PoetryContent) => {
            if (content !== null) {
                this.formTitle = `Editing "${content.title}"`;
                this.isCollection = content.meta.collection;

                this.poetryForm.setValue({
                    title: content.title,
                    desc: content.desc,
                    body: content.body,
                    category: content.meta.category,
                    form: content.meta.form,
                    genres: content.meta.genres,
                    rating: content.meta.rating,
                    status: content.meta.status,
                });
            } else {
                this.poetryForm.setValue({
                    title: '',
                    desc: '',
                    body: '',
                    category: null,
                    form: null,
                    genres: [],
                    rating: null,
                    status: null,
                });
            }
        });
    }

    get fields() {
        return this.poetryForm.controls;
    }

    goBack() {
        this.location.back();
    }

    submitForm(contentId?: string) {
        if (this.fields.title.invalid) {
            this.alerts.warn('Title field has an invalid length.');
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
        if (this.fields.form.invalid) {
            this.alerts.warn('Form is required.');
            return;
        }
        if (this.fields.genres.invalid) {
            this.alerts.warn('Invalid number of genres. Limit is 3.');
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

        const poetryInfo: CreatePoetry = {
            title: this.fields.title.value,
            desc: this.fields.desc.value,
            body: this.fields.body.value,
            category: this.fields.category.value,
            collection: this.isCollection,
            form: this.fields.form.value,
            genres: this.fields.genres.value,
            rating: this.fields.rating.value,
            status: this.fields.status.value,
        };

        if (contentId) {
            this.stuff.save(contentId, ContentKind.PoetryContent, poetryInfo).subscribe(() => {
                this.router.navigate(['/my-stuff/view-poetry']);
            });
        } else {
            this.stuff.create(ContentKind.PoetryContent, poetryInfo).subscribe(content => {
                this.stuff.setActive(content._id);
                this.router.navigate(['/my-stuff/view-prose']);
            });
        }
    }
}
