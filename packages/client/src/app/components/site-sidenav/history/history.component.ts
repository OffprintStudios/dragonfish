import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../../services/content';

import { ReadingHistory } from '@dragonfish/models/reading-history';
import { ContentKind } from '@dragonfish/models/content';

@Component({
    selector: 'sidenav-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.less'],
})
export class HistoryComponent implements OnInit {
    loading = false;
    histItems: ReadingHistory[];
    contentKind = ContentKind;

    constructor(private historyService: HistoryService) {
        this.fetchData();
    }

    ngOnInit(): void {}

    /**
     * Fetches a user's sitenav history.
     */
    fetchData() {
        this.loading = true;
        this.historyService.fetchUserSidenavHistory().subscribe((hist) => {
            this.histItems = hist;
            this.loading = false;
        });
    }
}
