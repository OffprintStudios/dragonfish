import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { ContentState } from '../../../repo/content';
import { Observable } from 'rxjs';
import { PoetryContent } from '@dragonfish/shared/models/content';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'dragonfish-poetry-page',
    templateUrl: './poetry-page.component.html',
})
export class PoetryPageComponent {
    @Select(ContentState.currContent) currPoetry$: Observable<PoetryContent>;
    pageNum = 1;

    constructor(public route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.fetchData();
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
