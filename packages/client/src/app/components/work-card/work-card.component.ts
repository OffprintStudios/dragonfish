import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as v from 'voca';
import { ContentKind, Genres } from '@pulp-fiction/models/content';

import { calculateApprovalRating } from '../../util/functions';

@Component({
    selector: 'work-card',
    templateUrl: './work-card.component.html',
    styleUrls: ['./work-card.component.less']
})
export class WorkCardComponent implements OnInit {
    @Input() content: any;
    @Input() showAuthor: boolean;

    contentKind = ContentKind;
    contentGenres = Genres;

    constructor() {}

    ngOnInit(): void {}

    calcApprovalRating(likes: number, dislikes: number) {
        return calculateApprovalRating(likes, dislikes);
    }
}