import { Component, OnInit } from '@angular/core';
import { ContentKind, ContentRating, NewsForm } from '@dragonfish/shared/models/content';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsCategory, NewsContentModel } from '@dragonfish/shared/models/content';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AlertsService } from '@dragonfish/client/alerts';
import { MyStuffService } from '../../repo/services';
import { MyStuffState } from '../../repo';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

@UntilDestroy()
@Component({
    selector: 'dragonfish-news-form',
    templateUrl: './news-form.component.html',
    styleUrls: ['./news-form.component.scss'],
})
export class NewsFormComponent implements OnInit {
    @Select(MyStuffState.currContent) currContent$: Observable<NewsContentModel>;
    formTitle = `Create a Newspost`;
    editMode = false;
    ratings = ContentRating;
    categories = NewsCategory;

    postForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        category: new FormControl(null, [Validators.required]),
    });

    constructor(private alerts: AlertsService, private stuff: MyStuffService) {}

    ngOnInit(): void {
        this.currContent$.pipe(untilDestroyed(this)).subscribe((content) => {
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

    switchView() {
        if (this.editMode === true) {
            this.editMode = false;
        } else {
            this.editMode = true;
        }
    }

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
            this.editMode = false;
            this.stuff.saveContent(contentId, ContentKind.NewsContent, formData);
        } else {
            this.stuff.createContent(ContentKind.NewsContent, formData);
        }
    }
}
