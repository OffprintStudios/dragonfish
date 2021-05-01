import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { UserState } from '../../../../repo/user';
import { PortfolioState } from '../../../../repo/portfolio';
import { ContentState } from '../../../../repo/content';
import { Observable } from 'rxjs';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { BlogsContentModel } from '@dragonfish/shared/models/content';
import { setTwoPartTitle } from '@dragonfish/shared/constants';


@Component({
    selector: 'dragonfish-portfolio-blog-page',
    templateUrl: './portfolio-blog-page.component.html',
    styleUrls: ['./portfolio-blog-page.component.scss']
})
export class PortfolioBlogPageComponent implements OnInit {
    @Select(PortfolioState.currPortfolio) portUser$: Observable<FrontendUser>;
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    @Select(ContentState.currContent) currContent$: Observable<BlogsContentModel>;

    pageNum = 1;
    loading = false;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.fetchData();
    }

    ngOnInit(): void {
        this.currContent$.subscribe((x) => {
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
