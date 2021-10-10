import { Component } from '@angular/core';
import { ProfileQuery } from '../../repo';

@Component({
    selector: 'dragonfish-profile-home',
    templateUrl: './profile-info.component.html',
    styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent {
    constructor(public profileQuery: ProfileQuery) {}
}
