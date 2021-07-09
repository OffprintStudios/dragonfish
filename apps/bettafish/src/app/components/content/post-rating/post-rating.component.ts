import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { ContentViewQuery, ContentViewService } from '@dragonfish/client/repository/content-view';
import { ReportDialogComponent } from '@dragonfish/client/ui';
import { CaseKind } from '@dragonfish/shared/models/case-files';
import { MatDialog } from '@angular/material/dialog';

@UntilDestroy()
@Component({
    selector: 'dragonfish-post-rating',
    templateUrl: './post-rating.component.html',
    styleUrls: ['./post-rating.component.scss'],
})
export class PostRatingComponent {
    ratingOption = RatingOption;
    optionsIsOpen = false;

    constructor(
        public viewQuery: ContentViewQuery,
        public viewService: ContentViewService,
        private dialog: MatDialog,
    ) {}

    /**
     * Opens the report dialog.
     * @param contentId
     */
    openReportDialog(contentId: string) {
        this.dialog.open(ReportDialogComponent, { data: { kind: CaseKind.Content, itemId: contentId } });
    }
}
