import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { MyStuffState } from '../../../../shared/my-stuff';

import { BlogForm, BlogsContentModel, ContentRating, PubStatus, ContentKind } from '@pulp-fiction/models/content';
import { AlertsService } from '../../../../shared/alerts';
import { MyStuffService } from '../../my-stuff.service';

@Component({
    selector: 'pulp-fiction-blog-form',
    templateUrl: './blog-form.component.html',
    styleUrls: ['./blog-form.component.less']
})
export class BlogFormComponent implements OnInit {
    @Select(MyStuffState.currContent) currContent$: Observable<BlogsContentModel>;
    editMode = false;
    ratings = ContentRating;
    pubStatus = PubStatus;

    formTitle: string = `Create a Blog`;

    blogForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        rating: new FormControl(null, [Validators.required])
    });

    constructor(private alerts: AlertsService, private stuff: MyStuffService) { }

    ngOnInit(): void {
        this.currContent$.subscribe(content => {
            if (content !== null) {
                this.formTitle = `Viewing "${content.title}"`;
                this.blogForm.setValue({
                    title: content.title,
                    body: content.body,
                    rating: content.meta.rating
                });
            } else {
                this.formTitle = `Create a Blog`;
                this.blogForm.setValue({
                    title: '',
                    body: '',
                    rating: null
                });
            }
        });
    }

    get fields() { return this.blogForm.controls; }

    switchView() {
        if (this.editMode === true) {
            this.editMode = false;
        } else {
            this.editMode = true;
        }
    }

    submitForm(contentId?: string) {
        if (this.blogForm.invalid) {
            this.alerts.warn(`Something's not right with the data you entered.`)
            return;
        }

        const formData: BlogForm = {
            title: this.fields.title.value,
            body: this.fields.body.value,
            rating: this.fields.rating.value
        };

        if (contentId) {
            this.stuff.saveContent(contentId, ContentKind.BlogContent, formData);
            this.editMode = false;
        } else {
            this.stuff.createContent(ContentKind.BlogContent, formData);
        }
    }
}
