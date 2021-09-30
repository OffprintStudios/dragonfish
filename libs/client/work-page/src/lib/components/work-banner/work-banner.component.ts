import { Component, Input } from '@angular/core';
import { AlertsService } from '@dragonfish/client/alerts';

@Component({
    selector: 'dragonfish-work-banner',
    templateUrl: './work-banner.component.html',
    styleUrls: ['./work-banner.component.scss'],
})
export class WorkBannerComponent {
    @Input() content;
    moreMenuOpened = false;

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
}
