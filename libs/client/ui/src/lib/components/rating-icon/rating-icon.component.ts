import { Component, Input } from '@angular/core';

import { ContentRating } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-rating-icon',
    templateUrl: './rating-icon.component.html',
    styleUrls: ['./rating-icon.component.scss'],
})
export class RatingIconComponent {
    @Input() rating: ContentRating;
    @Input() size = 'small'; // default to small if unset or set imporoperly

    constructor() {}
}
