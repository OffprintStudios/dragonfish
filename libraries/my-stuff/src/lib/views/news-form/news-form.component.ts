import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NewsCategory, NewsContentModel } from '@dragonfish/models/content';
import { MyStuffState } from '../../shared';
import { ContentRating, ContentKind, NewsForm } from '@dragonfish/models/content';
import { AlertsService } from '@dragonfish/alerts';
import { MyStuffFacade } from '../../facades';

@UntilDestroy()
@Component({
    selector: 'news-form',
    templateUrl: './news-form.component.html',
    styleUrls: ['./news-form.component.less'],
})
export class NewsFormComponent implements OnInit {
    @Select(MyStuffState.currContent) currContent$: Observable<NewsContentModel>;
    formTitle = `Create a Newspost`;
    editMode = false;
    ratings = ContentRating;
    categories = NewsCategory;

    postForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(36)]),
        desc: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        category: new FormControl(null, [Validators.required]),
    });

    constructor(private alerts: AlertsService, private stuff: MyStuffFacade) {}

    ngOnInit(): void {
        this.currContent$.pipe(untilDestroyed(this)).subscribe((content) => {
            if (content !== null) {
                this.formTitle = `Viewing "${content.title}"`;
                this.postForm.setValue({
                    title: content.title,
                    desc: content.desc,
                    body: content.body,
                    category: content.meta.category,
                });
            } else {
                this.formTitle = `Create a Newspost`;
                this.postForm.setValue({
                    title: '',
                    desc: '',
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
            desc: this.fields.desc.value,
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
