import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { PoetryContent, ProseContent } from '@pulp-fiction/models/content';

import { FrontendUser } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';
import { PortWorks } from '../../../models/site';
import { QueueService } from '../../../services/admin';
import { AuthService } from '../../../services/auth';
import { WorksService } from '../../../services/content';
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
    proseData: PaginateResult<ProseContent>;
    poetryData: PaginateResult<PoetryContent>;
    pageNum = 1;

    poetryView = false;
    addingNewWork = false;

    searchWorks = new FormGroup({
        query: new FormControl('')
    });

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService,
        private worksService: WorksService, private queueService: QueueService, private dialog: MatDialog) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
        Title.setThreePartTitle(this.portUser.username, Constants.WORKS);

        this.route.data.subscribe(data => {
            const feedData = data.feedData as PortWorks;
            this.proseData = feedData.prose;
            this.poetryData = feedData.poetry;
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
        if (this.poetryView === true) {
            this.poetryView = false;
            this.router.navigate([], {relativeTo: this.route, queryParams: {page: 1}, queryParamsHandling: 'merge'});
        } else {
            this.poetryView = true;
            this.router.navigate([], {relativeTo: this.route, queryParams: {page: 1}, queryParamsHandling: 'merge'});
        }
    }

    /**
     * TODO: implement search functionality here
     */
    searchFor() {
      return;
    }

    /**
     * Calculates the approval rating based on number of likes and dislikes.
     * 
     * @param likes The number of likes
     * @param dislikes The number of dislikes
     */
    calcApprovalRating(likes: number, dislikes: number) {
      return calculateApprovalRating(likes, dislikes);
    }
}