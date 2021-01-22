import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../shared/user';

import { ContentModel } from '@pulp-fiction/models/content';
import { FrontendUser } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';
import { Constants, Title } from '../../../shared';

@Component({
    selector: 'port-works',
    templateUrl: './works.component.html',
    styleUrls: ['./works.component.less']
})
export class WorksComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    portUser: FrontendUser;
    contentData: PaginateResult<ContentModel>;
    pageNum = 1;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
        Title.setThreePartTitle(this.portUser.username, Constants.WORKS);

        this.route.data.subscribe(data => {
            this.contentData = data.feedData as PaginateResult<ContentModel>;
        });
    }

    /**
     * Handles page changing
     * 
     * @param event The new page
     */
    onPageChange(event: number) {
        this.router.navigate([], {relativeTo: this.route, queryParams: {page: event}, queryParamsHandling: 'merge'});
        this.pageNum = event;
    }

    /**
     * Checks to see if the currently logged in user is the same as the user who owns this portfolio.
     */
    currentUserIsSame() {
        if (this.currentUser) {
            if (this.portUser) {
                if (this.currentUser._id === this.portUser._id) {
                    return true;
                } else {
                return false;
                }
            }
        }
    }
}