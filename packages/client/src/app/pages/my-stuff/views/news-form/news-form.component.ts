import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Select } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';
import { NewsCategory, NewsContentModel } from '@pulp-fiction/models/content';
import { MyStuffState, MyStuff } from '../../../../shared/my-stuff';
import { ContentRating, ContentKind, NewsForm } from '@pulp-fiction/models/content';
import { AlertsService } from 'packages/client/src/app/shared/alerts';

@UntilDestroy()
@Component({
    selector: 'news-form',
    templateUrl: './news-form.component.html',
    styleUrls: ['./news-form.component.less']
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
        category: new FormControl(null, [Validators.required])
    });

    constructor(private alerts: AlertsService) {}

    ngOnInit(): void {
        this.currContent$.pipe(untilDestroyed(this)).subscribe(content => {
            if (content !== null) {
                this.formTitle = `Viewing "${content.title}"`;
                this.postForm.setValue({
                    title: content.title,
                    desc: content.desc,
                    body: content.body,
                    category: content.meta.category
                });
            } else {
                this.formTitle = `Create a Newspost`;
                this.postForm.setValue({
                    title: '',
                    desc: '',
                    body: '',
                    category: null
                });
            }
        });
    }

    get fields() { return this.postForm.controls; }

    switchView() {
        if (this.editMode === true) {
            this.editMode = false;
        } else {
            this.editMode = true;
        }
    }

    submitForm(contentId?: string) {
        if (this.postForm.invalid) {
            this.alerts.warn(`Check the form fields for any errors.`)
            return;
        }

        const formData: NewsForm = {
            title: this.fields.title.value,
            desc: this.fields.desc.value,
            body: this.fields.body.value,
            category: this.fields.category.value
        };

        if (contentId) {
            this.saveContent(contentId, ContentKind.NewsContent, formData);
        } else {
            this.createContent(ContentKind.NewsContent, formData);
        }
    }

    @Dispatch()
    private createContent(kind: ContentKind, formInfo: NewsForm) {
        return [new MyStuff.CreateContent(kind, formInfo), new Navigate(['/my-stuff'])];
    }

    @Dispatch()
    private saveContent(contentId: string, kind: ContentKind, formInfo: NewsForm) {
        this.editMode = false;
        return new MyStuff.SaveContent(contentId, kind, formInfo);
    }
}