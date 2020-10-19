import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { FrontendUser } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';
import { Work } from '@pulp-fiction/models/works';
import { PortWorks } from '../../../models/site';
import { AuthService } from '../../../services/auth';
import { Constants, Title } from '../../../shared';
import { calculateApprovalRating } from '../../../util/functions';

@Component({
    selector: 'port-works',
    templateUrl: './works.component.html',
    styleUrls: ['./works.component.less']
})
export class WorksComponent implements OnInit {
    currentUser: FrontendUser;
    portUser: FrontendUser;
    worksData: PaginateResult<Work>
    userWorksData: PaginateResult<Work>
    pageNum = 1;

    listView = false;

    searchWorks = new FormGroup({
        query: new FormControl('')
    });

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
        Title.setThreePartTitle(this.portUser.username, Constants.WORKS);

        this.route.data.subscribe(data => {
            const feedData = data.feedData as PortWorks;
            this.worksData = feedData.works;
            this.userWorksData = feedData.userWorks;
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

    /**
     * Switches the view
     */
    switchView() {
        if (this.listView === true) {
            this.listView = false;
            this.router.navigate([], {relativeTo: this.route, queryParams: {page: 1}, queryParamsHandling: 'merge'});
        } else {
            this.listView = true;
            this.router.navigate([], {relativeTo: this.route, queryParams: {page: 1}, queryParamsHandling: 'merge'});
        }
    }

    /**
     * Calculates a work's approval rating.
     * 
     * @param likes Number of likes
     * @param dislikes Number of dislikes
     */
    calcApprovalRating(likes: number, dislikes: number) {
        return calculateApprovalRating(likes, dislikes);
    }

    /**
     * Searches through a user's works
     */
    searchFor() {
        return;
    }
}