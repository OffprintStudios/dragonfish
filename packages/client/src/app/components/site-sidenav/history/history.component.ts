import { Component, OnInit } from '@angular/core';

import { ReadingHistory } from '@dragonfish/models/reading-history';
import { ContentKind } from '@dragonfish/models/content';

import { NetworkService } from '../../../services';

@Component({
    selector: 'sidenav-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.less'],
})
export class HistoryComponent implements OnInit {
    loading = false;
    histItems: ReadingHistory[];
    contentKind = ContentKind;

    constructor(private networkService: NetworkService) {
        this.fetchData();
    }

    ngOnInit(): void {}

    /**
     * Fetches a user's sitenav history.
     */
    fetchData() {
        this.loading = true;
        this.networkService.fetchUserSidenavHistory().subscribe((hist) => {
            this.histItems = hist;
            this.loading = false;
        });
    }
}
