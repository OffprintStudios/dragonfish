import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogForm, BlogsContentModel, ContentRating, PubStatus, ContentKind } from '@dragonfish/shared/models/content';
import { AlertsService } from '@dragonfish/client/alerts';
import { MyStuffService, MyStuffQuery } from '@dragonfish/client/repository/my-stuff';
import { Router } from '@angular/router';

@Component({
    selector: 'dragonfish-blog-form',
    templateUrl: './blog-form.component.html',
    styleUrls: ['./blog-form.component.scss'],
})
export class BlogFormComponent implements OnInit {
    editMode = false;
    ratings = ContentRating;
    pubStatus = PubStatus;

    formTitle = `Create a Blog`;

    blogForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
        rating: new FormControl(null, [Validators.required]),
    });

    constructor(
        private alerts: AlertsService,
        private stuff: MyStuffService,
        public stuffQuery: MyStuffQuery,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.stuffQuery.current$.subscribe((content: BlogsContentModel) => {
            if (content !== null && content !== undefined) {
                this.formTitle = `Viewing "${content.title}"`;
                this.blogForm.setValue({
                    title: content.title,
                    body: content.body,
                    rating: content.meta.rating,
                });
            } else {
                this.formTitle = `Create a Blog`;
                this.blogForm.setValue({
                    title: '',
                    body: '',
                    rating: null,
                });
            }
        });
    }

    get fields() {
        return this.blogForm.controls;
    }

    switchView() {
        this.editMode = this.editMode !== true;
    }

    goBack() {
        this.router.navigate(['/my-stuff']);
    }

    submitForm(contentId?: string) {
        if (this.blogForm.invalid) {
            this.alerts.warn(`Something's not right with the data you entered.`);
            return;
        }

        const formData: BlogForm = {
            title: this.fields.title.value,
            body: this.fields.body.value,
            rating: this.fields.rating.value,
        };

        if (contentId) {
            this.stuff.save(contentId, ContentKind.BlogContent, formData).subscribe(() => {
                this.editMode = false;
            });
        } else {
            this.stuff.create(ContentKind.BlogContent, formData).subscribe(content => {
                this.stuff.setActive(content._id);
                this.router.navigate(['/my-stuff/view-blog']);
            });
        }
    }
}
