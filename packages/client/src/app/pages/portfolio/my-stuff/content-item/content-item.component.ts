import { Component, Input, OnInit } from '@angular/core';
import { ContentModel, ContentKind, PubStatus } from '@pulp-fiction/models/content';

@Component({
    selector: 'content-item',
    templateUrl: './content-item.component.html',
    styleUrls: ['./content-item.component.less']
})
export class ContentItemComponent implements OnInit {
    @Input() content: ContentModel;

    contentKind = ContentKind;
    pubStatus = PubStatus;
    
    constructor() {}

    ngOnInit(): void {}
}