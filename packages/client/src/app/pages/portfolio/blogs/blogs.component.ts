import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AuthState } from '../../../shared/auth';

import { FrontendUser } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';
import { Constants, Title } from '../../../shared';
import { BlogsContentModel } from '@pulp-fiction/models/content';

@Component({
    selector: 'port-blogs',
    templateUrl: './blogs.component.html',
    styleUrls: ['./blogs.component.less']
})
export class BlogsComponent implements OnInit {
    @Select(AuthState.user) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

    portUser: FrontendUser;
    blogsData: PaginateResult<BlogsContentModel>

    pageNum = 1;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.currentUserSubscription = this.currentUser$.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
        Title.setThreePartTitle(this.portUser.username, Constants.BLOGS);

        this.route.data.subscribe(data => {
            this.blogsData = data.feedData as PaginateResult<BlogsContentModel>;
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
        return this.currentUser && this.portUser && this.currentUser._id === this.portUser._id;
    }
  }