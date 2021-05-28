import { Component, OnInit } from '@angular/core';
import { PopupModel } from '@dragonfish/shared/models/util';
import { PopupComponent } from '@dragonfish/client/ui';
import { MatDialog } from '@angular/material/dialog';
import { ReadingHistoryQuery, ReadingHistoryService } from '@dragonfish/client/repository/reading-history';

@Component({
    selector: 'dragonfish-history-feed',
    templateUrl: './history-feed.component.html',
    styleUrls: ['./history-feed.component.scss'],
})
export class HistoryFeedComponent implements OnInit {
    constructor(
        public historyService: ReadingHistoryService,
        private dialog: MatDialog,
        public historyQuery: ReadingHistoryQuery,
    ) {}

    ngOnInit(): void {
        this.historyService.fetch().subscribe();
    }

    askDelete() {
        const alertData: PopupModel = {
            message: 'Are you sure you want to delete this? This action is irreversible.',
            confirm: true,
        };
        const dialogRef = this.dialog.open(PopupComponent, { data: alertData });
        dialogRef.afterClosed().subscribe((wantsToDelete: boolean) => {
            if (wantsToDelete) {
                this.historyService.delete(this.historyQuery.currentIds as string[]).subscribe();
            }
        });
    }
}
