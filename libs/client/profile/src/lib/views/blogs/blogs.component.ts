import { Component, OnInit } from '@angular/core';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { BlogsContentModel, ContentKind } from '@dragonfish/shared/models/content';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { AppQuery } from '@dragonfish/client/repository/app';
import { untilDestroyed } from '@ngneat/until-destroy';
import { Constants, setThreePartTitle } from '@dragonfish/shared/constants';
import { ProfileQuery } from '../../repo';

@Component({
    selector: 'dragonfish-profile-blogs',
    templateUrl: './blogs.component.html',
})
export class BlogsComponent implements OnInit {
    loading = false;
    blogsData: PaginateResult<BlogsContentModel>;

    pageNum = 1;

    constructor(
        private network: DragonfishNetworkService,
        private route: ActivatedRoute,
        private router: Router,
        public sessionQuery: SessionQuery,
        public profileQuery: ProfileQuery,
        private appQuery: AppQuery,
    ) {}

    ngOnInit(): void {
        this.route.queryParamMap.pipe(untilDestroyed(this)).subscribe((params) => {
            this.pageNum = params.has('page') ? +params.get('page') : 1;
            setThreePartTitle(this.profileQuery.userTag, Constants.BLOGS);
            this.fetchData(this.pageNum, this.profileQuery.profileId);
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
        this.network
            .fetchAllContent(pageNum, [ContentKind.BlogContent], this.appQuery.filter, userId)
            .subscribe((content) => {
                this.blogsData = content as PaginateResult<BlogsContentModel>;
                this.loading = false;
            });
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     * @param userId
     */
    onPageChange(event: number, userId: string) {
        this.router
            .navigate([], {
                relativeTo: this.route,
                queryParams: { page: event },
                queryParamsHandling: 'merge',
            })
            .then(() => {
                this.fetchData(event, userId);
            });
        this.pageNum = event;
    }
}
