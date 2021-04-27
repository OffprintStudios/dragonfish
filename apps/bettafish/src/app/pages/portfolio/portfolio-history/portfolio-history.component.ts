import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { ReadingHistory } from '@dragonfish/shared/models/reading-history';
import { ContentKind } from '@dragonfish/shared/models/content';
import { setTwoPartTitle, Constants } from '@dragonfish/shared/constants';
import { Observable, combineLatest } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserState } from '../../../repo/user';
import { NetworkService } from '../../../services';

@UntilDestroy()
@Component({
    selector: 'dragonfish-portfolio-history',
    templateUrl: './portfolio-history.component.html'
})
export class PortfolioHistoryComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;

    histList: PaginateResult<ReadingHistory>;
    contentKind = ContentKind;
    loading = false;
    pageNum = 1;

    constructor(private network: NetworkService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        setTwoPartTitle(Constants.HISTORY);
        combineLatest(this.currentUser$, this.route.queryParamMap)
            .pipe(untilDestroyed(this))
            .subscribe(value => {
                const [currentUser, params] = value;
                this.pageNum = params.has('page') ? +params.get('page') : 1;
                this.fetchData(this.pageNum);
            });
    }

    /**
     * Fetches data for the current page.
     *
     * @param event The page to fetch.
     * @private
     */
    private fetchData(event: number) {
        this.loading = true;
        this.network.fetchUserHistory(event).subscribe(x => {
            this.histList = x;
            this.loading = false;
        }, error => {
            console.log(error);
            this.loading = false;
        });
    }

    /**
     * Handles page changing
     *
     * @param event The new page
     */
    onPageChange(event: number) {
        this.pageNum = event;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: this.pageNum },
            queryParamsHandling: 'merge',
        });
    }

    /**
     * Deletes a history document from a user's reading history.
     *
     * @param histId The history document
     */
    askDelete(histId: string) {
        if (confirm(`Are you sure you want to delete this? This action cannot be reversed.`)) {
            this.network.changeHistoryVisibility(histId).subscribe(() => {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { page: this.pageNum },
                    queryParamsHandling: 'merge',
                });
            });
        } else {
            return;
        }
    }

    /**
     * Checks to see if the list of history documents is empty
     */
    isHistoryEmpty() {
        if (this.histList) {
            return this.histList.docs.length === 0;
        }
    }
}
