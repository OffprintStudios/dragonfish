import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsCategory } from '@dragonfish/shared/models/content';
import { CommentKind } from '@dragonfish/shared/models/comments';
import { setTwoPartTitle } from '@dragonfish/shared/constants';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ContentViewQuery, ContentViewService } from '@dragonfish/client/repository/content-view';
import { combineLatest } from 'rxjs';

@UntilDestroy()
@Component({
    selector: 'dragonfish-news-page',
    templateUrl: './news-page.component.html',
    styleUrls: ['./news-page.component.scss'],
})
export class NewsPageComponent implements OnInit {
    category = NewsCategory;
    pageNum = 1; // For comments pages
    kind = CommentKind.ContentComment; // Sets the item kind for comments

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public viewState: ContentViewQuery,
        public viewService: ContentViewService,
    ) {}

    ngOnInit(): void {
        combineLatest(this.viewState.currContent$, this.route.queryParamMap)
            .pipe(untilDestroyed(this))
            .subscribe((x) => {
                const [content, queryParams] = x;
                setTwoPartTitle(content.title);

                if (queryParams.has('page')) {
                    this.pageNum = +queryParams.get('page');
                }
            });
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     * @param contentId
     */
    onPageChange(event: number, contentId: string) {
        if (event !== 1) {
            this.router
                .navigate([], {
                    relativeTo: this.route,
                    queryParams: { page: event },
                    queryParamsHandling: 'merge',
                })
                .then(() => {
                    this.viewService.fetchNextComments(contentId, event);
                });
        } else {
            this.router.navigate([], { relativeTo: this.route }).then(() => {
                this.viewService.fetchNextComments(contentId, 1);
            });
        }
    }
}
