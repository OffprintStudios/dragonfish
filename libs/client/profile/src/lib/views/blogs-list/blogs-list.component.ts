import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { ProfileQuery, ProfileService } from '../../repo';
import { ListPages } from '../../models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlertsService } from '@dragonfish/client/alerts';
import { BlogForm, ContentRating, PubStatus } from '@dragonfish/shared/models/content';

@UntilDestroy()
@Component({
    selector: 'dragonfish-blogs-list',
    templateUrl: './blogs-list.component.html',
    styleUrls: ['./blogs-list.component.scss'],
    animations: [
        trigger('inOutAnimation', [
            transition(':enter', [
                style({ height: 65, opacity: 0 }),
                animate('.250s ease-in-out', style({ height: 250, opacity: 1 })),
            ]),
            transition(':leave', [
                style({ height: 250, opacity: 1 }),
                animate('.250s ease-in-out', style({ height: 0, opacity: 0 })),
            ]),
        ]),
    ],
})
export class BlogsListComponent implements OnInit {
    collapsed = true;

    tabs = ListPages;
    selectedTab = ListPages.Published;

    blogForm = new FormGroup({
        title: new FormControl(''),
        body: new FormControl(''),
    });

    constructor(
        public pseudQuery: PseudonymsQuery,
        public profileQuery: ProfileQuery,
        public auth: AuthService,
        public sessionQuery: SessionQuery,
        private profile: ProfileService,
        private alerts: AlertsService,
    ) {}

    ngOnInit() {
        this.profile.fetchBlogsList().pipe(untilDestroyed(this)).subscribe();
    }

    toggleForm() {
        this.collapsed = !this.collapsed;
        this.blogForm.reset();
    }

    changeTab(newTab: ListPages) {
        this.selectedTab = newTab;
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

        this.profile.createBlog(formInfo).subscribe((content) => {
            if (!asDraft) {
                this.profile
                    .publishBlog(content._id, {
                        oldStatus: content.audit.published,
                        newStatus: PubStatus.Published,
                    })
                    .subscribe();
            }

            this.toggleForm();
        });
    }
}
