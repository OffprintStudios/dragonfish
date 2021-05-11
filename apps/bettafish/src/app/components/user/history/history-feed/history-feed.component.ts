import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { HistoryService, HistoryState, HistoryStateModel } from '@dragonfish/client/repository/history';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'dragonfish-history-feed',
    templateUrl: './history-feed.component.html',
    styleUrls: ['./history-feed.component.scss'],
})
export class HistoryFeedComponent implements OnInit {
    @Select(HistoryState) historyState$: Observable<HistoryStateModel>;

    constructor(public historyService: HistoryService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.historyService.fetch();
    }

    askDelete(docIds: string[]) {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.historyService.delete(docIds);
            }
        });
    }
}
