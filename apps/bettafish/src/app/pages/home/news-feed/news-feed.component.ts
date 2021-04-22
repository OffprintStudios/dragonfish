import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { NewsContentModel, NewsCategory } from '@dragonfish/shared/models/content';
import { setTwoPartTitle, Constants} from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-news-feed',
    templateUrl: './news-feed.component.html',
    styleUrls: ['./news-feed.component.scss'],
})
export class NewsFeedComponent implements OnInit {
    posts: PaginateResult<NewsContentModel>;
    pageNum = 1;
    category = NewsCategory;

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.posts = data.feedData;
        });
        setTwoPartTitle(Constants.NEWS);
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
