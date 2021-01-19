import { Component, OnInit, Input, Output } from '@angular/core';
import { slugify } from 'voca';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { ContentKind } from '@pulp-fiction/models/content';

@Component({
    selector: 'notif-item',
    templateUrl: './notif-item.component.html',
    styleUrls: ['./notif-item.component.less']
})
export class NotifItemComponent implements OnInit {
    @Input() notif: any; // this is `any` because different notification documents have different fields
    @Output() onSelected: string;

    constructor(private store: Store) {}

    ngOnInit(): void {}

    sendTo() {
        switch (this.notif.parentKind) {
            case ContentKind.ProseContent:
                this.store.dispatch(new Navigate([`/prose/${this.notif.sourceId}/${slugify(this.notif.parentTitle)}`]));
                break;
            case ContentKind.PoetryContent:
                this.store.dispatch(new Navigate([`/poetry/${this.notif.sourceId}/${slugify(this.notif.parentTitle)}`]));
                break;
            case ContentKind.BlogContent:
                this.store.dispatch(new Navigate([`/portfolio/${this.notif.destinationUserId}/a-human/blog/${this.notif.sourceId}`]));
                break;
            case ContentKind.NewsContent:
                this.store.dispatch(new Navigate([`/post/${this.notif.sourceId}/${slugify(this.notif.parentTitle)}`]));
                break;
        }
    }
}