import { Component } from '@angular/core';
import { WorkPageQuery, WorkPageService } from '@dragonfish/client/repository/work-page';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { AuthService } from '@dragonfish/client/repository/session/services';

@Component({
    selector: 'dragonfish-content-info',
    templateUrl: './content-info.component.html',
    styleUrls: ['./content-info.component.scss'],
})
export class ContentInfoComponent {
    ratingOption = RatingOption;

    constructor(
        public workQuery: WorkPageQuery,
        public workPage: WorkPageService,
        public session: SessionQuery,
        public auth: AuthService,
    ) {}
}
