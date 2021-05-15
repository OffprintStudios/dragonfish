import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsCategory } from '@dragonfish/shared/models/content';
import { ItemKind } from '@dragonfish/shared/models/comments';
import { setTwoPartTitle } from '@dragonfish/shared/constants';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ContentViewQuery } from '@dragonfish/client/repository/content-view';

@UntilDestroy()
@Component({
    selector: 'dragonfish-news-page',
    templateUrl: './news-page.component.html',
    styleUrls: ['./news-page.component.scss'],
})
export class NewsPageComponent implements OnInit {
    category = NewsCategory;
    pageNum = 1; // For comments pages
    itemKind = ItemKind.NewsContent; // Sets the item kind for comments

    constructor(private router: Router, private route: ActivatedRoute, public viewState: ContentViewQuery) {
        this.fetchData();
    }

    ngOnInit(): void {
        this.viewState.currContent$.pipe(untilDestroyed(this)).subscribe((x) => {
            setTwoPartTitle(x.title);
        });
    }

    private fetchData() {
        const queryParams = this.route.snapshot.queryParamMap;
        if (queryParams.get('page') !== null) {
            this.pageNum = +queryParams.get('page');
        }
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     */
    onPageChange(event: number) {
        if (event !== 1) {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { page: event },
                queryParamsHandling: 'merge',
            });
        } else {
            this.router.navigate([], { relativeTo: this.route });
        }
    }
}
