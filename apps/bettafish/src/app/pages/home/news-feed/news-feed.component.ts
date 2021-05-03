import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { NewsContentModel, NewsCategory, ContentKind } from '@dragonfish/shared/models/content';
import { setTwoPartTitle, Constants} from '@dragonfish/shared/constants';
import { untilDestroyed } from '@ngneat/until-destroy';
import { NetworkService } from '../../../services';

@Component({
    selector: 'dragonfish-news-feed',
    templateUrl: './news-feed.component.html',
    styleUrls: ['./news-feed.component.scss'],
})
export class NewsFeedComponent implements OnInit {
    posts: PaginateResult<NewsContentModel>;
    pageNum = 1;
    category = NewsCategory;
    loading = false;

    constructor(private route: ActivatedRoute, private router: Router, private network: NetworkService) {}

    ngOnInit(): void {
        this.route.queryParamMap.pipe(untilDestroyed(this)).subscribe(params => {
            if (params.has('page')) {
                this.pageNum = +params.get('page');
            }
            this.fetchData(this.pageNum);
        });

        setTwoPartTitle(Constants.NEWS);
    }

    /**
     * Fetches data for the current page.
     *
     * @param pageNum the page to fetch
     * @private
     */
    private fetchData(pageNum: number) {
        this.loading = true;
        this.network.fetchAllNew(pageNum, [ContentKind.NewsContent])
            .subscribe(result => {
                this.posts = result as PaginateResult<NewsContentModel>;
                this.loading = false;
            }, () => {
                this.loading = false;
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
