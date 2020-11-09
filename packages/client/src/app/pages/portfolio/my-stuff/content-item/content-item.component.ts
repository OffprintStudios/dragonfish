import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ContentKind, PubStatus } from '@pulp-fiction/models/content';
import { ContentItem } from '../viewmodels';

@Component({
    selector: 'content-item',
    templateUrl: './content-item.component.html',
    styleUrls: ['./content-item.component.less']
})
export class ContentItemComponent implements OnInit {
    @Input() content: ContentItem;
    @Input() selected: boolean;
    @Output() selectItem = new EventEmitter<ContentItem>();
    @Output() viewItem = new EventEmitter<ContentItem>();

    contentKind = ContentKind;
    pubStatus = PubStatus;

    constructor() {}

    ngOnInit(): void {}

    select() {
        this.selectItem.emit(this.content);
        this.content.selected = true;
        this.selected = true;
    }

    view() {
        this.selected = false;
        this.viewItem.emit(this.content);
    }
}