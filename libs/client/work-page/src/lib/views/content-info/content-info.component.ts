import { Component, HostListener, OnInit } from '@angular/core';
import { WorkPageQuery, WorkPageService } from '@dragonfish/client/repository/work-page';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { isMobile } from '@dragonfish/shared/functions';

@Component({
    selector: 'dragonfish-content-info',
    templateUrl: './content-info.component.html',
    styleUrls: ['./content-info.component.scss'],
})
export class ContentInfoComponent implements OnInit {
    ratingOption = RatingOption;
    mobileMode = false;
    mobileShowDescription = false;

    constructor(
        public workQuery: WorkPageQuery,
        public workPage: WorkPageService,
        public session: SessionQuery,
        public auth: AuthService,
    ) {}

    ngOnInit(): void {
        this.onResize();
    }

    toggleShowDescription() {
        this.mobileShowDescription = !this.mobileShowDescription;
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.mobileMode = isMobile();
    }
}
