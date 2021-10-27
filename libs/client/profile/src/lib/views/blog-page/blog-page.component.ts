import { Component, OnInit } from '@angular/core';
import { CommentKind } from '@dragonfish/shared/models/comments';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { setTwoPartTitle } from '@dragonfish/shared/constants';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { MatDialog } from '@angular/material/dialog';
import { BlogPageQuery, BlogPageService } from '@dragonfish/client/repository/profile/blog-page';
import { BlogForm, BlogsContentModel, PubStatus } from '@dragonfish/shared/models/content';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { ActivatedRoute } from '@angular/router';
import { MAX_TITLE_LENGTH, MIN_TEXT_LENGTH } from '@dragonfish/shared/constants/content-constants';

@UntilDestroy()
@Component({
    selector: 'dragonfish-blog-page',
    templateUrl: './blog-page.component.html',
    styleUrls: ['./blog-page.component.scss'],
})
export class BlogPageComponent implements OnInit {
    pageNum = 1;
    editMode = false;
    moreMenuOpened = false;
    kind = CommentKind.ContentComment; // Sets the item kind for comments
    pubStatus = PubStatus;

    blogForm = new FormGroup({
        title: new FormControl('', [
            Validators.required,
            Validators.minLength(MIN_TEXT_LENGTH),
            Validators.maxLength(MAX_TITLE_LENGTH)
        ]),
        body: new FormControl('', [Validators.required, Validators.minLength(MIN_TEXT_LENGTH)]),
    });

    constructor(
        public session: AuthService,
        public pseudQuery: PseudonymsQuery,
        public blogQuery: BlogPageQuery,
        public route: ActivatedRoute,
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

    toggleMoreMenu() {
        this.moreMenuOpened = !this.moreMenuOpened;
    }

    submitForm(blog: BlogsContentModel) {
        if (this.blogForm.controls.title.invalid) {
            this.alerts.warn('Title field has an invalid length. Maximum is '+ MAX_TITLE_LENGTH + ' characters.');
            return;
        }
        if (this.blogForm.controls.body.invalid) {
            this.alerts.warn('Body text is too short.');
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

    publishBlog(blog: BlogsContentModel, pubStatus: PubStatus) {
        this.blogService
            .publish(blog._id, {
                oldStatus: blog.audit.published,
                newStatus: pubStatus,
            })
            .subscribe();
    }
}
