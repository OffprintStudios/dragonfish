import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../../services/content';

import { History } from '@pulp-fiction/models/history';

@Component({
  selector: 'sidenav-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {
  loading = false;
  histItems: History[];

  constructor(private historyService: HistoryService) {
    // this.fetchData();
  }

  ngOnInit(): void {
  }

  /**
   * Fetches a user's sitenav history.
   */
  fetchData() {
    this.loading = true;
    this.historyService.fetchUserSidenavHistory().subscribe(hist => {
      this.histItems = hist;
      this.loading = false;
    });
  }
}
