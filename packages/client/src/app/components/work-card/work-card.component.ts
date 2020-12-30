import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as v from 'voca';
import { ContentKind } from '@pulp-fiction/models/content';

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

    constructor(private router: Router) {}

    ngOnInit(): void {}

    navigateToWork(kind: ContentKind) {
        if (kind === ContentKind.ProseContent) {
            this.router.navigate(['/prose', this.content._id, v.slugify(this.content.title)]);
        } else if (kind === ContentKind.PoetryContent) {
            this.router.navigate(['/poetry', this.content._id, v.slugify(this.content.title)]);
        }
    }

    calcApprovalRating(likes: number, dislikes: number) {
        return calculateApprovalRating(likes, dislikes);
    }
}