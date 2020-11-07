import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SectionItem } from '../viewmodels';

@Component({
    selector: 'section-item',
    templateUrl: './section-item.component.html',
    styleUrls: ['./section-item.component.less']
})
export class SectionItemComponent implements OnInit {
    @Input() section: SectionItem;
    @Input() selected: boolean;
    @Output() selectItem = new EventEmitter<boolean>();

    previewMode = true;

    constructor() {}

    ngOnInit(): void {}

    select() {
        this.selectItem.emit(true);
        this.section.selected = true;
        this.selected = true;
    }

    switchView() {
        if (this.previewMode === true) {
            this.previewMode = false;
        } else {
            this.previewMode = true;
        }
    }
}