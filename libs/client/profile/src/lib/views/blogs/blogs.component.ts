import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants, setThreePartTitle } from '@dragonfish/shared/constants';
import { ProfileQuery } from '../../repo';
import { UserBlogsQuery, UserBlogsService } from '@dragonfish/client/repository/profile/user-blogs';
import { ListPages } from '../../models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogForm, BlogsContentModel, ContentRating, PubStatus } from '@dragonfish/shared/models/content';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { AlertsService } from '@dragonfish/client/alerts';
import { take } from 'rxjs/operators';
import { AuthService } from '@dragonfish/client/repository/session/services';

@Component({
    selector: 'dragonfish-profile-blogs',
    templateUrl: './blogs.component.html',
})
export class BlogsComponent implements OnInit {
    collapsed = true;

    tabs = ListPages;
    selectedTab = ListPages.Published;

    blogForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]),
        body: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    constructor(
        private userBlogs: UserBlogsService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private alerts: AlertsService,
        public auth: AuthService,
        public profileQuery: ProfileQuery,
        public userBlogsQuery: UserBlogsQuery,
    ) {}

    ngOnInit(): void {
        setThreePartTitle(this.profileQuery.userTag, Constants.BLOGS);
    }

    toggleForm() {
        this.collapsed = !this.collapsed;
        this.blogForm.reset();
    }

    changeTab(newTab: ListPages) {
        this.selectedTab = newTab;
    }

    onPageChange(event: number) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event },
            queryParamsHandling: 'merge',
        });
    }

    submitForm(asDraft: boolean) {
        if (this.blogForm.invalid) {
            this.alerts.error(`Check the info you entered and try again.`);
            return;
        }

        const formInfo: BlogForm = {
            title: this.blogForm.controls.title.value,
            body: this.blogForm.controls.body.value,
            rating: ContentRating.Everyone,
        };

        this.userBlogs.create(formInfo).subscribe((content) => {
            if (!asDraft) {
                this.publishBlog(content as BlogsContentModel, PubStatus.Published);
            }

            this.toggleForm();
        });
    }

    publishBlog(blog: BlogsContentModel, pubStatus: PubStatus) {
        this.userBlogs
            .publish(blog._id, {
                oldStatus: blog.audit.published,
                newStatus: pubStatus,
            })
            .subscribe();
    }

    deleteBlog(id: string) {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((wantsToDelete: boolean) => {
                if (wantsToDelete) {
                    this.userBlogs.delete(id).subscribe();
                }
            });
    }
}
