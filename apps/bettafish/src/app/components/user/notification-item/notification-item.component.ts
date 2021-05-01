import { Component, Input, Output, EventEmitter } from '@angular/core';
import { slugify } from 'voca';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { ContentKind } from '@dragonfish/shared/models/content';

@Component({
    selector: 'dragonfish-notification-item',
    templateUrl: './notification-item.component.html',
    styleUrls: ['./notification-item.component.scss'],
})
export class NotificationItemComponent {
    @Input() notif: any; // this is `any` because different notification documents have different fields
    @Output() onSelected: EventEmitter<string> = new EventEmitter<string>();
    @Output() onDeselected: EventEmitter<string> = new EventEmitter<string>();

    constructor(private store: Store) {}

    sendTo(): void {
        switch (this.notif.parentKind) {
            case ContentKind.ProseContent:
                this.store.dispatch(new Navigate([`/prose/${this.notif.sourceId}/${slugify(this.notif.parentTitle)}`]));
                break;
            case ContentKind.PoetryContent:
                this.store.dispatch(
                    new Navigate([`/poetry/${this.notif.sourceId}/${slugify(this.notif.parentTitle)}`]),
                );
                break;
            case ContentKind.BlogContent:
                this.store.dispatch(
                    new Navigate([`/portfolio/${this.notif.destinationUserId}/a-human/blog/${this.notif.sourceId}`]),
                );
                break;
            case ContentKind.NewsContent:
                this.store.dispatch(new Navigate([`/post/${this.notif.sourceId}/${slugify(this.notif.parentTitle)}`]));
                break;
        }
    }

    selectNotif(): void {
        this.notif.selected = true;
        this.onSelected.emit(this.notif._id);
    }

    deselectNotif(): void {
        this.notif.selected = false;
        this.onDeselected.emit(this.notif._id);
    }
}
