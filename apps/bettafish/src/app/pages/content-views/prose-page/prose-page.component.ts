import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProseContent } from '@dragonfish/shared/models/content';
import { ContentState } from '../../../repo/content';
import { setTwoPartTitle } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-prose-page',
    templateUrl: './prose-page.component.html',
})
export class ProsePageComponent implements OnInit {
    @Select(ContentState.currContent) currProse$: Observable<ProseContent>;
    pageNum = 1;

    constructor(public route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.fetchData();
        this.currProse$.subscribe((currProse) => {
            setTwoPartTitle(currProse.title);
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
