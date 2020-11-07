import { Component, Input, OnInit } from '@angular/core';
import { SectionItem } from '../viewmodels';

@Component({
    selector: 'section-item',
    templateUrl: './section-item.component.html',
    styleUrls: ['./section-item.component.less']
})
export class SectionItemComponent implements OnInit {
    @Input() section: SectionItem;

    constructor() {}

    ngOnInit(): void {}
}