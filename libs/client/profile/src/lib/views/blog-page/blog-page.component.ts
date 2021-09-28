import { Component, OnInit } from '@angular/core';
import { CommentKind } from '@dragonfish/shared/models/comments';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentViewQuery, ContentViewService } from '@dragonfish/client/repository/content-view';
import { combineLatest } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { setTwoPartTitle } from '@dragonfish/shared/constants';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from '../../repo';
import { BlogForm, BlogsContentModel } from '@dragonfish/shared/models/content';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@dragonfish/client/alerts';
import { AuthService } from '@dragonfish/client/repository/session/services';

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
        private route: ActivatedRoute,
        private router: Router,
        public viewQuery: ContentViewQuery,
        public session: AuthService,
        public pseudQuery: PseudonymsQuery,
        private viewService: ContentViewService,
        private dialog: MatDialog,
        private profile: ProfileService,
        private alerts: AlertsService,
    ) {}

    ngOnInit(): void {
        combineLatest([this.viewQuery.currContent$, this.route.queryParamMap])
            .pipe(untilDestroyed(this))
            .subscribe((x) => {
                const [content, queryParams] = x;
                setTwoPartTitle(content.title);
                this.blogForm.setValue({
                    title: content.title,
                    body: content.body,
                });

                if (queryParams.has('page')) {
                    this.pageNum = +queryParams.get('page');
                }
            });
    }

    /**
     * Changes query params to the appropriate page.
     * @param event The page changed to
     * @param contentId
     */
    onPageChange(event: number, contentId: string) {
        if (event !== 1) {
            this.router
                .navigate([], {
                    relativeTo: this.route,
                    queryParams: { page: event },
                    queryParamsHandling: 'merge',
                })
                .then(() => {
                    this.viewService.fetchNextComments(contentId, event);
                });
        } else {
            this.router.navigate([], { relativeTo: this.route }).then(() => {
                this.viewService.fetchNextComments(contentId, 1);
            });
        }
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

        this.profile.editBlog(blog._id, formInfo).subscribe(() => {
            this.toggleEdits();
        });
    }

    deleteBlog(id: string) {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.profile.deleteBlog(id).subscribe();
            }
        });
    }
}
