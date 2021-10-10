import { Component } from '@angular/core';
import { ProfileQuery } from '@dragonfish/client/repository/profile';

@Component({
    selector: 'dragonfish-profile-home',
    templateUrl: './profile-info.component.html',
    styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent {
    constructor(public profileQuery: ProfileQuery) {}
}
