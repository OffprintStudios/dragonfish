import { Component, OnInit } from '@angular/core';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ContentKind, ContentModel } from '@dragonfish/shared/models/content';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Constants, setTwoPartTitle } from '@dragonfish/shared/constants';
import { AppQuery } from '@dragonfish/client/repository/app';

@UntilDestroy()
@Component({
    selector: 'dragonfish-newest-works',
    templateUrl: './newest-works.component.html',
    styleUrls: ['./newest-works.component.scss'],
})
export class NewestWorksComponent implements OnInit {
    loading = false;
    works: PaginateResult<ContentModel>;
    pageNum = 1;

    constructor(
        private network: DragonfishNetworkService,
        private route: ActivatedRoute,
        private router: Router,
        private appQuery: AppQuery,
    ) { }

    ngOnInit(): void {
        setTwoPartTitle(Constants.NEWEST_WORKS);
        this.route.queryParamMap.pipe(untilDestroyed(this)).subscribe(params => {
            if (params.has('page')) {
                this.pageNum = +params.get('page');
            }
            this.fetchData(this.pageNum);
        });
    }

    /**
     * Fetches the current page of works.
     *
     * @param pageNum
     * @private
     */
    private fetchData(pageNum: number): void {
        this.loading = true;
        this.network.fetchAllNew(pageNum, [ContentKind.PoetryContent, ContentKind.ProseContent], this.appQuery.filter)
            .subscribe({
                next: (result) => {
                    this.works = result;
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                }
            });
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     */
    onPageChange(event: number) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: event },
            queryParamsHandling: 'merge',
        });
        this.pageNum = event;
    }
}
