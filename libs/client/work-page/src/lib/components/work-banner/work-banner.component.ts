import { Component, Input } from '@angular/core';
import { AlertsService } from '@dragonfish/client/alerts';
import { ContentKind } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-work-banner',
    templateUrl: './work-banner.component.html',
    styleUrls: ['./work-banner.component.scss'],
})
export class WorkBannerComponent {
    @Input() content;
    moreMenuOpened = false;
    addEditIcon = false;

    constructor(private alerts: AlertsService) {}

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
        this.alerts.info(`This feature is not yet available!`);
    }
}
