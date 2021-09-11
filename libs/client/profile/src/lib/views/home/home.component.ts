import { Component } from '@angular/core';
import { ProfileQuery } from '../../repo';

@Component({
    selector: 'dragonfish-profile-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    constructor(public profileQuery: ProfileQuery) {}
}
