import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { setTwoPartTitle } from '@dragonfish/shared/constants';
import { ContentViewQuery, ContentViewService } from '@dragonfish/client/repository/content-view';
import { combineLatest } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { CommentKind } from '@dragonfish/shared/models/comments';

@Component({
    selector: 'dragonfish-portfolio-blog-page',
    templateUrl: './portfolio-blog-page.component.html',
    styleUrls: ['./portfolio-blog-page.component.scss'],
})
export class PortfolioBlogPageComponent implements OnInit {
    pageNum = 1;
    loading = false;
    kind = CommentKind.ContentComment; // Sets the item kind for comments

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public viewQuery: ContentViewQuery,
        private viewService: ContentViewService,
    ) {}

    ngOnInit(): void {
        combineLatest([this.viewQuery.currContent$, this.route.queryParamMap])
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
     * Changes query params to the appropriate page.
     * @param event The page changed to
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
