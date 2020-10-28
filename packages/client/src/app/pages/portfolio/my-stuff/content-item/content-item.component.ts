import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ContentModel, ContentKind, PubStatus } from '@pulp-fiction/models/content';

@Component({
    selector: 'content-item',
    templateUrl: './content-item.component.html',
    styleUrls: ['./content-item.component.less']
})
export class ContentItemComponent implements OnInit {
    @Input() content: ContentModel;
    @Input() selected: boolean;
    @Output() selectItem = new EventEmitter<ContentModel>();
    @Output() viewItem = new EventEmitter<ContentModel>();

    contentKind = ContentKind;
    pubStatus = PubStatus;

    constructor() {}

    ngOnInit(): void {}

    select() {
        this.selectItem.emit(this.content);
        this.content.audit.selected = true;
        this.selected = true;
    }

    view() {
        this.selected = false;
        this.viewItem.emit(this.content);
    }
}