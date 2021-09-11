import { Component } from '@angular/core';
import { CommentKind } from '@dragonfish/shared/models/comments';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentViewQuery, ContentViewService } from '@dragonfish/client/repository/content-view';
import { combineLatest } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-blog-page',
    templateUrl: './blog-page.component.html',
    styleUrls: ['./blog-page.component.scss'],
})
export class BlogPageComponent {
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
