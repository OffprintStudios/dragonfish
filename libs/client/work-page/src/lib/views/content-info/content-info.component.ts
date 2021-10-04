import { Component } from '@angular/core';
import { WorkPageQuery, WorkPageService } from '@dragonfish/client/repository/work-page';
import { RatingOption } from '@dragonfish/shared/models/reading-history';

@Component({
    selector: 'dragonfish-content-info',
    templateUrl: './content-info.component.html',
    styleUrls: ['./content-info.component.scss'],
})
export class ContentInfoComponent {
    ratingOption = RatingOption;

    constructor(public workQuery: WorkPageQuery, public workPage: WorkPageService) {}
}
