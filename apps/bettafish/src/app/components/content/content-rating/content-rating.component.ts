import { Component } from '@angular/core';
import { ContentModel, ContentKind } from '@dragonfish/shared/models/content';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';
import { AddToCollectionComponent } from '../collections/add-to-collection/add-to-collection.component';
import { ContentViewQuery, ContentViewService } from '@dragonfish/client/repository/content-view';
import { ReportDialogComponent } from '@dragonfish/client/ui';
import { CaseKind } from '@dragonfish/shared/models/case-files';

@UntilDestroy()
@Component({
    selector: 'dragonfish-content-rating',
    templateUrl: './content-rating.component.html',
    styleUrls: ['./content-rating.component.scss'],
})
export class ContentRatingComponent {
    ratingOption = RatingOption;
    contentKind = ContentKind;
    optionsIsOpen = false;

    constructor(
        private dialog: MatDialog,
        public viewService: ContentViewService,
        public viewQuery: ContentViewQuery,
    ) {}

    /**
     * Opens the Add To Collection dialog box.
     */
    openAddToCollectionDialog(content: ContentModel) {
        this.dialog.open(AddToCollectionComponent, { data: { content: content } });
    }

    /**
     * Opens the report dialog.
     * @param contentId
     */
    openReportDialog(contentId: string) {
        this.dialog.open(ReportDialogComponent, { data: { kind: CaseKind.Content, itemId: contentId } });
    }
}
