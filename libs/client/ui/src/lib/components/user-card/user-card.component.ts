import { Component, Input } from '@angular/core';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Component({
    selector: 'dragonfish-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
    @Input() user: Pseudonym;

    constructor() {}
}
