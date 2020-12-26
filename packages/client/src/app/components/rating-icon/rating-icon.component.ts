import { Component, OnInit, Input } from '@angular/core';

import { ContentRating } from '@pulp-fiction/models/content';

@Component({
    selector: 'rating-icon',
    templateUrl: './rating-icon.component.html',
    styleUrls: ['./rating-icon.component.less']
})
export class RatingIconComponent implements OnInit {
    @Input() rating: ContentRating;
    @Input() size: string = 'small'; // default to small if unset or set imporoperly

    constructor() {}

    ngOnInit(): void {}
}