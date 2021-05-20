import { Component, OnInit } from '@angular/core';
import { ContentKind, ContentRating, NewsForm } from '@dragonfish/shared/models/content';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsCategory, NewsContentModel } from '@dragonfish/shared/models/content';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlertsService } from '@dragonfish/client/alerts';
import { MyStuffService, MyStuffQuery } from '@dragonfish/client/repository/my-stuff';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
    selector: 'dragonfish-news-form',
    templateUrl: './news-form.component.html',
    styleUrls: ['./news-form.component.scss'],
})
export class NewsFormComponent implements OnInit {
    formTitle = `Create a Newspost`;
    editMode = false;
    ratings = ContentRating;
    categories = NewsCategory;

    postForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        category: new FormControl(null, [Validators.required]),
    });

    constructor(
        private alerts: AlertsService,
        private stuff: MyStuffService,
        public stuffQuery: MyStuffQuery,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.stuffQuery.current$.pipe(untilDestroyed(this)).subscribe((content: NewsContentModel) => {
            if (content !== null) {
                this.formTitle = `Viewing "${content.title}"`;
                this.postForm.setValue({
                    title: content.title,
                    body: content.body,
                    category: content.meta.category,
                });
            } else {
                this.formTitle = `Create a Newspost`;
                this.postForm.setValue({
                    title: '',
                    body: '',
                    category: null,
                });
            }
        });
    }

    get fields() {
        return this.postForm.controls;
    }

    goBack() {
        this.router.navigate(['/my-stuff'])
    }

    switchView = () => this.editMode = !this.editMode;

    submitForm(contentId?: string) {
        if (this.postForm.invalid) {
            this.alerts.warn(`Check the form fields for any errors.`);
            return;
        }

        const formData: NewsForm = {
            title: this.fields.title.value,
            body: this.fields.body.value,
            category: this.fields.category.value,
        };

        if (contentId) {
            this.stuff.save(contentId, ContentKind.NewsContent, formData).subscribe(() => {
                this.editMode = false;
            });
        } else {
            this.stuff.create(ContentKind.NewsContent, formData).subscribe(content => {
                this.stuff.setActive(content._id);
                this.router.navigate(['/my-stuff/view-post']);
            });
        }
    }
}
