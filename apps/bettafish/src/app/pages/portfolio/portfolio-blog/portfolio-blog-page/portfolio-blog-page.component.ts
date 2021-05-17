import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { setTwoPartTitle } from '@dragonfish/shared/constants';
import { ContentViewQuery } from '@dragonfish/client/repository/content-view';

@Component({
    selector: 'dragonfish-portfolio-blog-page',
    templateUrl: './portfolio-blog-page.component.html',
    styleUrls: ['./portfolio-blog-page.component.scss']
})
export class PortfolioBlogPageComponent implements OnInit {
    pageNum = 1;
    loading = false;

    constructor(private route: ActivatedRoute, private router: Router, public viewQuery: ContentViewQuery) {}

    ngOnInit(): void {
        this.fetchData();
        this.viewQuery.currContent$.subscribe((x) => {
            setTwoPartTitle(x.title);
        });
    }

    /**
     * Fetches the current page of comments.
     */
    private fetchData() {
        const queryParams = this.route.snapshot.queryParamMap;
        if (queryParams.get('page') !== null) {
            this.pageNum = +queryParams.get('page');
        }
    }

    /**
     * Changes query params to the appropriate page.
     * @param event The page changed to
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
