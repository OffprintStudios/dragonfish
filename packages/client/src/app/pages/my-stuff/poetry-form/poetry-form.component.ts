import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';
import { MyStuff, MyStuffState } from '../../../shared/my-stuff';

import { WorkKind, CreatePoetry, PoetryForm, Genres, 
  ContentRating, WorkStatus, PoetryContent, ContentKind } from '@pulp-fiction/models/content';
import { PoetryService } from '../../../services/user';
import { ActivatedRoute } from '@angular/router';
import { AlertsService } from '../../../shared/alerts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'poetry-form',
  templateUrl: './poetry-form.component.html',
  styleUrls: ['./poetry-form.component.less']
})
export class PoetryFormComponent implements OnInit {
    @Select(MyStuffState.currContent) currContent$: Observable<PoetryContent>;
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
        status: new FormControl(null, [Validators.required])
    });

    constructor(private poetryService: PoetryService, private alerts: AlertsService) {}

    ngOnInit(): void {
        this.currContent$.pipe(untilDestroyed(this)).subscribe(content => {
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
                    status: content.meta.status
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
                    status: null
                });
            }
        });
    }

    get fields() { return this.poetryForm.controls; }

    submitForm(contentId?: string) {
        if (this.poetryForm.invalid) {
            this.alerts.warn(`Looks like something's wrong with the stuff you've entered.`);
            return;
        }

        const poetryInfo: CreatePoetry ={
            title: this.fields.title.value,
            desc: this.fields.desc.value,
            body: this.fields.body.value,
            category: this.fields.category.value,
            collection: this.isCollection,
            form: this.fields.form.value,
            genres: this.fields.genres.value,
            rating: this.fields.rating.value,
            status: this.fields.status.value
        };

        if (contentId) {
            this.saveContent(contentId, ContentKind.PoetryContent, poetryInfo);
        } else {
            this.createContent(ContentKind.PoetryContent, poetryInfo);
        }
    }

    @Dispatch()
    private createContent(kind: ContentKind, formInfo: CreatePoetry) {
        return [new MyStuff.CreateContent(kind, formInfo), new Navigate(['/my-stuff'])];
    }

    @Dispatch()
    private saveContent(contentId: string, kind: ContentKind, formInfo: CreatePoetry) {
        return new MyStuff.SaveContent(contentId, kind, formInfo);
    }
}
