import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { setTwoPartTitle } from '@dragonfish/shared/constants';
import { ContentViewQuery } from '@dragonfish/client/repository/content-view';

@Component({
    selector: 'dragonfish-poetry-page',
    templateUrl: './poetry-page.component.html',
})
export class PoetryPageComponent implements OnInit {
    pageNum = 1;

    constructor(public route: ActivatedRoute, private router: Router, public viewQuery: ContentViewQuery) {}

    ngOnInit(): void {
        this.fetchData();
        this.viewQuery.currContent$.subscribe((currPoetry) => {
            setTwoPartTitle(currPoetry.title);
        })
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
