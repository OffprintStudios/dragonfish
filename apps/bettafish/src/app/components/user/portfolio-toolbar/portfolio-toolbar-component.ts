import { Component } from '@angular/core';
import { PortfolioQuery } from '@dragonfish/client/repository/portfolio';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { ReportDialogComponent } from '@dragonfish/client/ui';
import { CaseKind } from '@dragonfish/shared/models/case-files';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'dragonfish-portfolio-toolbar',
    templateUrl: './portfolio-toolbar.component.html',
    styleUrls: ['./portfolio-toolbar.component.scss'],
})
export class PortfolioToolbarComponent {
    constructor(public sessionQuery: SessionQuery, public portfolioQuery: PortfolioQuery, private dialog: MatDialog) {}

    /**
     * Opens the report dialog.
     * @param userId
     */
    openReportDialog(userId: string) {
        this.dialog.open(ReportDialogComponent, { data: { kind: CaseKind.Users, itemId: userId } });
    }
}
