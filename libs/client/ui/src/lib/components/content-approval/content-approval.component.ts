import { Component, Input } from '@angular/core';
import { ContentViewService } from '@dragonfish/client/repository/content-view';
import { MatDialog } from '@angular/material/dialog';
import { ContentKind, ContentModel } from '@dragonfish/shared/models/content';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { ReportDialogComponent } from '@dragonfish/client/ui';
import { CaseKind } from '@dragonfish/shared/models/case-files';
import { RatingsModel } from '@dragonfish/shared/models/ratings';
import { AddToCollectionComponent } from '../add-to-collection/add-to-collection.component';

@Component({
    selector: 'dragonfish-content-approval',
    templateUrl: './content-approval.component.html',
    styleUrls: ['./content-approval.component.scss'],
})
export class ContentApprovalComponent {
    @Input() content: ContentModel;
    @Input() currRating: RatingOption;
    @Input() ratingsDoc: RatingsModel;
    @Input() likes: number;
    @Input() dislikes: number;
    contentKind = ContentKind;
    ratingOption = RatingOption;
    optionsIsOpen = false;

    constructor(public viewService: ContentViewService, private dialog: MatDialog) {}

    /**
     * Opens the Add To Collection dialog box.
     */
    openAddToCollectionDialog() {
        this.dialog.open(AddToCollectionComponent, { data: { content: this.content } });
    }

    /**
     * Opens the report dialog.
     * @param contentId
     */
    openReportDialog(contentId: string) {
        this.dialog.open(ReportDialogComponent, { data: { kind: CaseKind.Content, itemId: contentId } });
    }
}
