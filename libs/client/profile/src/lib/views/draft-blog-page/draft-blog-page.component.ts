import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogForm, BlogsContentModel, ContentRating, PubStatus } from '@dragonfish/shared/models/content';
import { map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from '../../repo';
import { Pseudonym } from '@dragonfish/shared/models/accounts';
import { slugify } from 'voca';
import { AlertsService } from '@dragonfish/client/alerts';

@UntilDestroy()
@Component({
    selector: 'dragonfish-draft-blog-page',
    templateUrl: './draft-blog-page.component.html',
    styleUrls: ['./draft-blog-page.component.scss'],
})
export class DraftBlogPageComponent implements OnInit {
    blog: BlogsContentModel;
    editMode = false;

    blogForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private profile: ProfileService,
        private alerts: AlertsService,
    ) {}

    ngOnInit(): void {
        this.route.data
            .pipe(
                map((content) => {
                    this.blog = content.contentData as BlogsContentModel;
                    this.blogForm.setValue({
                        title: this.blog.title,
                        body: this.blog.body,
                    });
                }),
                untilDestroyed(this),
            )
            .subscribe();
    }

    toggleEdits() {
        this.editMode = !this.editMode;
    }

    submitForm() {
        if (this.blogForm.invalid) {
            this.alerts.error(`Check the info you entered and try again.`);
            return;
        }

        const formInfo: BlogForm = {
            title: this.blogForm.controls.title.value,
            body: this.blogForm.controls.body.value,
            rating: this.blog.meta.rating,
        };

        this.profile.editBlog(this.blog._id, formInfo).subscribe(() => {
            this.toggleEdits();
        });
    }

    publishBlog() {
        this.profile
            .publishBlog(this.blog._id, {
                oldStatus: this.blog.audit.published,
                newStatus: PubStatus.Published,
            })
            .subscribe(() => {
                const author = this.blog.author as Pseudonym;
                this.router.navigate([
                    '/profile',
                    author._id,
                    author.userTag,
                    'post',
                    this.blog._id,
                    slugify(this.blog.title),
                ]);
            });
    }

    deleteBlog() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.profile.deleteBlog(this.blog._id).subscribe();
            }
        });
    }
}
