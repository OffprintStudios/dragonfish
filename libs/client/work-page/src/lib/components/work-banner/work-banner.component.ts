import { Component, Input } from '@angular/core';
import { AlertsService } from '@dragonfish/client/alerts';
import { ContentKind } from '@dragonfish/shared/models/content';
import { UploadCoverArtComponent } from '../../../../../my-stuff/src/lib/components';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'dragonfish-work-banner',
    templateUrl: './work-banner.component.html',
    styleUrls: ['./work-banner.component.scss'],
})
export class WorkBannerComponent {
    @Input() content;
    moreMenuOpened = false;
    addEditIcon = false;

    constructor(private alerts: AlertsService, private dialog: MatDialog) {}

    toggleMoreMenu() {
        this.moreMenuOpened = !this.moreMenuOpened;
    }

    addToLibrary() {
        this.alerts.info(`This feature is not yet available!`);
    }

    shareContent() {
        this.alerts.info(`This feature is not yet available!`);
    }

    reportContent() {
        this.alerts.info(`This feature is not yet available!`);
    }

    uploadCoverArt(id: string, kind: ContentKind) {
        this.dialog.open(UploadCoverArtComponent, { data: { kind: kind, contentId: id } });
    }
}
