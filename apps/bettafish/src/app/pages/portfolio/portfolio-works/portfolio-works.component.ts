import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ContentKind, ContentModel } from '@dragonfish/shared/models/content';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { Constants, setThreePartTitle } from '@dragonfish/shared/constants';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PortfolioQuery } from '@dragonfish/client/repository/portfolio';
import { AppQuery } from '@dragonfish/client/repository/app';

@UntilDestroy()
@Component({
    selector: 'dragonfish-portfolio-works',
    templateUrl: './portfolio-works.component.html'
})
export class PortfolioWorksComponent implements OnInit {
    loading = false;
    contentData: PaginateResult<ContentModel>;
    pageNum = 1;

    constructor(
        private network: DragonfishNetworkService,
        private route: ActivatedRoute,
        private router: Router,
        public sessionQuery: SessionQuery,
        public portQuery: PortfolioQuery,
        private appQuery: AppQuery,
    ) {}

    ngOnInit(): void {
        this.route.queryParamMap.pipe(untilDestroyed(this))
            .subscribe(params => {
                this.pageNum = params.has('page') ? +params.get('page') : 1;
                setThreePartTitle(this.portQuery.portUserName, Constants.WORKS);
                this.fetchData(this.pageNum, this.portQuery.portUserId);
            });
    }

    /**
     * Fetches data for the current page.
     *
     * @param pageNum The page number
     * @param userId The user ID related to the content
     * @private
     */
    private fetchData(pageNum: number, userId: string): void {
        this.loading = true;
        this.network.fetchAllContent(
            pageNum,
            [ContentKind.ProseContent, ContentKind.PoetryContent],
            this.appQuery.filter,
            userId
        )
            .subscribe(content => {
                this.contentData = content;
                this.loading = false;
            });
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     * @param userId
     */
    onPageChange(event: number, userId: string): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event },
            queryParamsHandling: 'merge',
        }).then(() => {
            this.fetchData(event, userId);
        });
        this.pageNum = event;
    }
}
