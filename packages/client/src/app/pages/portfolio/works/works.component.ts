import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FrontendUser } from '@pulp-fiction/models/users';
import { PaginateResult } from '@pulp-fiction/models/util';
import { Work } from '@pulp-fiction/models/works';
import { AuthService } from '../../../services/auth';
import { Constants, Title } from '../../../shared';

@Component({
    selector: 'port-works',
    templateUrl: './works.component.html',
    styleUrls: ['./works.component.less']
})
export class WorksComponent implements OnInit {
    currentUser: FrontendUser;
    portUser: FrontendUser;
    worksData: PaginateResult<Work>
    pageNum = 1;

    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
        this.authService.currUser.subscribe(x => {
            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        this.portUser = this.route.parent.snapshot.data.portData as FrontendUser;
        Title.setThreePartTitle(this.portUser.username, Constants.WORKS);
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
}