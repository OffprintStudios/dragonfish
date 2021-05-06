import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { UserState } from '../../../../repo/user';
import { Observable } from 'rxjs';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { ReadingHistory } from '@dragonfish/shared/models/reading-history';
import { ContentKind } from '@dragonfish/shared/models/content';
import { NetworkService } from '../../../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'dragonfish-history-feed',
    templateUrl: './history-feed.component.html',
    styleUrls: ['./history-feed.component.scss'],
})
export class HistoryFeedComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;

    histList: PaginateResult<ReadingHistory>;
    contentKind = ContentKind;
    loading = false;
    pageNum = 1;

    constructor(private network: NetworkService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.fetchData(this.pageNum);
    }

    /**
     * Fetches data for the current page.
     *
     * @param event The page to fetch.
     * @private
     */
    fetchData(event: number) {
        /*this.loading = true;
        this.network.fetchUserHistory(event).subscribe(x => {
            this.histList = x;
            this.loading = false;
        }, () => {
            this.loading = false;
        });*/
    }

    /**
     * Deletes a history document from a user's reading history.
     *
     * @param histId The history document
     */
    askDelete(histId: string) {
        /*if (confirm(`Are you sure you want to delete this? This action cannot be reversed.`)) {
            this.network.changeHistoryVisibility(histId).subscribe(() => {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { page: this.pageNum },
                    queryParamsHandling: 'merge',
                });
            });
        } else {
            return;
        }*/
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
