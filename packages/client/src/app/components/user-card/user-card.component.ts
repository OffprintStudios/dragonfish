import { Component, Input, OnInit } from '@angular/core';
import { FrontendUser } from '@pulp-fiction/models/users';

@Component({
    selector: 'user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.less']
})
export class UserCardComponent implements OnInit {
    @Input() user: FrontendUser;

    constructor() {}

    ngOnInit(): void {}
}