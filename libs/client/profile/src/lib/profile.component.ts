import { Component } from '@angular/core';
import { ProfileQuery } from './repo';

@Component({
    selector: 'dragonfish-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
    constructor(public profileQuery: ProfileQuery) {}
}
