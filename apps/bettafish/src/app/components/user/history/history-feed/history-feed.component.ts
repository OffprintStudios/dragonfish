import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { HistoryService, HistoryState, HistoryStateModel } from '../../../../repo/history';

@Component({
    selector: 'dragonfish-history-feed',
    templateUrl: './history-feed.component.html',
    styleUrls: ['./history-feed.component.scss'],
})
export class HistoryFeedComponent implements OnInit {
    @Select(HistoryState) historyState$: Observable<HistoryStateModel>;

    constructor(private historyService: HistoryService) {}

    ngOnInit(): void {
        this.historyService.fetch();
    }
}
