import { Component, OnInit } from '@angular/core';
import { CommentKind } from '@dragonfish/shared/models/comments';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { setTwoPartTitle } from '@dragonfish/shared/constants';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { MatDialog } from '@angular/material/dialog';
import { BlogPageQuery, BlogPageService } from '@dragonfish/client/repository/profile/blog-page';
import { BlogForm, BlogsContentModel } from '@dragonfish/shared/models/content';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { AuthService } from '@dragonfish/client/repository/session/services';

@UntilDestroy()
@Component({
    selector: 'dragonfish-blog-page',
    templateUrl: './blog-page.component.html',
    styleUrls: ['./blog-page.component.scss'],
})
export class BlogPageComponent implements OnInit {
    pageNum = 1;
    editMode = false;
    kind = CommentKind.ContentComment; // Sets the item kind for comments

    blogForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    constructor(
        public session: AuthService,
        public pseudQuery: PseudonymsQuery,
        public blogQuery: BlogPageQuery,
        private blogService: BlogPageService,
        private dialog: MatDialog,
        private blog: BlogPageService,
        private alerts: AlertsService,
    ) {}

    ngOnInit(): void {
        this.blogQuery.blog$.pipe(untilDestroyed(this)).subscribe((blog) => {
            setTwoPartTitle(blog.title);
            this.blogForm.setValue({
                title: blog.title,
                body: blog.body,
            });
        });
    }

    toggleEdits() {
        this.editMode = !this.editMode;
    }

    submitForm(blog: BlogsContentModel) {
        if (this.blogForm.invalid) {
            this.alerts.error(`Check the info you entered and try again.`);
            return;
        }

        const formInfo: BlogForm = {
            title: this.blogForm.controls.title.value,
            body: this.blogForm.controls.body.value,
            rating: blog.meta.rating,
        };

        this.blog.edit(blog._id, formInfo).subscribe(() => {
            this.toggleEdits();
        });
    }
}
