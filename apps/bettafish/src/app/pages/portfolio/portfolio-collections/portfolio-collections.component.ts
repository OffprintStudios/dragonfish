import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { Collection } from '@dragonfish/shared/models/collections';
import { Constants, setTwoPartTitle, setThreePartTitle } from '@dragonfish/shared/constants';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PortfolioQuery } from '@dragonfish/client/repository/portfolio';

@UntilDestroy()
@Component({
    selector: 'dragonfish-portfolio-collections',
    templateUrl: './portfolio-collections.component.html',
    styleUrls: ['./portfolio-collections.component.scss']
})
export class PortfolioCollectionsComponent implements OnInit {
    currPageCollections: PaginateResult<Collection>;
    loading = false;
    pageNum = 1;

    constructor(
        public route: ActivatedRoute,
        private router: Router,
        private network: DragonfishNetworkService,
        public sessionQuery: SessionQuery,
        public portQuery: PortfolioQuery,
    ) {}

    ngOnInit(): void {
        combineLatest([this.sessionQuery.currentUser$, this.route.queryParamMap])
            .pipe(untilDestroyed(this))
            .subscribe(value => {
                const [currUser, params] = value;
                this.pageNum = params.has('page') ? +params.get('page') : 1;
                if ((currUser !== null) && (currUser._id === this.portQuery.portUserId)) {
                    this.fetchData(this.pageNum);
                    setTwoPartTitle(Constants.COLLECTIONS);
                } else {
                    this.fetchData(this.pageNum, this.portQuery.portUserId);
                    setThreePartTitle(this.portQuery.portUserName, Constants.COLLECTIONS);
                }
            });
    }

    /**
     * Fetches collections from the backend. Performs an optional, additional check for the owner
     * of this portfolio.
     *
     * @param pageNum The current page
     * @param userId (Optional) The portfolio owner
     * @private
     */
    private fetchData(pageNum: number, userId?: string) {
        this.loading = true;
        if (userId) {
            this.network.fetchPublicCollections(userId, pageNum).subscribe(x => {
                this.currPageCollections = x;
                this.loading = false;
            });
        } else {
            this.network.fetchAllCollections(pageNum).subscribe(x => {
                this.currPageCollections = x;
                this.loading = false;
            });
        }
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     */
    onPageChange(event: number): void {
        this.pageNum = event;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: this.pageNum },
            queryParamsHandling: 'merge',
        });
    }
}
