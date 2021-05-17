import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { ContentViewQuery, ContentViewService } from '@dragonfish/client/repository/content-view';

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
    ) {}
}
