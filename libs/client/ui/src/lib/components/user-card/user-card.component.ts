import { Component, Input } from '@angular/core';
import { FrontendUser } from '@dragonfish/shared/models/users';

@Component({
    selector: 'dragonfish-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
    @Input() user: FrontendUser;

    constructor() {}
}
