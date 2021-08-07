import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    WorkKind,
    Genres,
    ContentRating,
    WorkStatus,
    CreateProse,
    ContentKind,
    ProseContent,
    TagKind,
} from '@dragonfish/shared/models/content';
import { AlertsService } from '@dragonfish/client/alerts';
import { Location } from '@angular/common';
import { MyStuffQuery, MyStuffService } from '@dragonfish/client/repository/my-stuff';
import { Router } from '@angular/router';
import { TagsQuery, TagsService } from '@dragonfish/client/repository/tags';

@UntilDestroy()
@Component({
    selector: 'dragonfish-prose-form',
    templateUrl: './prose-form.component.html',
    styleUrls: ['./prose-form.component.scss'],
})
export class ProseFormComponent implements OnInit {
    formTitle = `Create New Prose`;

    categories = WorkKind;
    genres = Genres;
    ratings = ContentRating;
    statuses = WorkStatus;

    proseForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        desc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        category: new FormControl(null, [Validators.required]),
        genres: new FormControl([], [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
        tags: new FormControl([], [Validators.maxLength(5)]),
        rating: new FormControl(null, [Validators.required]),
        status: new FormControl(null, [Validators.required]),
    });

    constructor(
        private stuff: MyStuffService,
        public stuffQuery: MyStuffQuery,
        private alerts: AlertsService,
        private location: Location,
        private router: Router,
        public tagsQuery: TagsQuery,
        private tagsService: TagsService,
    ) {}

    ngOnInit(): void {
        this.tagsService.fetchTagsTrees(TagKind.Fandom).subscribe();

        this.stuffQuery.current$.pipe(untilDestroyed(this)).subscribe((content: ProseContent) => {
            if (content !== null) {
                this.formTitle = `Editing "${content.title}"`;
                this.proseForm.setValue({
                    title: content.title,
                    desc: content.desc,
                    body: content.body,
                    category: content.meta.category,
                    genres: content.meta.genres,
                    tags: [],
                    rating: content.meta.rating,
                    status: content.meta.status,
                });
            } else {
                this.proseForm.setValue({
                    title: '',
                    desc: '',
                    body: '',
                    category: null,
                    genres: [],
                    tags: [],
                    rating: null,
                    status: null,
                });
            }
        });
    }

    goBack() {
        this.location.back();
    }

    get fields() {
        return this.proseForm.controls;
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
        if (this.fields.genres.invalid) {
            this.alerts.warn('Invalid number of genres. Limit is 3.');
            return;
        }
        if (this.fields.tags.invalid) {
            this.alerts.warn('Invalid number of tags. Limit is 5.');
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

        const proseInfo: CreateProse = {
            title: this.fields.title.value,
            desc: this.fields.desc.value,
            body: this.fields.body.value,
            category: this.fields.category.value,
            genres: this.fields.genres.value,
            tags: this.fields.tags.value,
            rating: this.fields.rating.value,
            status: this.fields.status.value,
        };

        if (contentId) {
            this.stuff.save(contentId, ContentKind.ProseContent, proseInfo).subscribe(() => {
                this.router.navigate(['/my-stuff/view-prose']);
            });
        } else {
            this.stuff.create(ContentKind.ProseContent, proseInfo).subscribe(content => {
                this.stuff.setActive(content._id);
                this.router.navigate(['/my-stuff/view-prose']);
            });
        }
    }
}
