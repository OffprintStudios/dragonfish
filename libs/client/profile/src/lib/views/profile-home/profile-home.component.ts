import { Component } from '@angular/core';
import { ProfileQuery } from '@dragonfish/client/repository/profile';

@Component({
    selector: 'dragonfish-profile',
    templateUrl: './profile-home.component.html',
})
export class ProfileHomeComponent {
    constructor(public profileQuery: ProfileQuery) {}
}
